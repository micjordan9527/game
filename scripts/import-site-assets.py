"""Import a fixed list of public Site assets on an isolated synchronization branch."""
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import base64

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://baowang-knowledge.aurora-5448.chatgpt.site"
manifest = json.loads((ROOT / ".openai/github-asset-import.json").read_text())
assert manifest["origin"] == ORIGIN
assert len(manifest["files"]) <= 8
verify_only = sys.argv[1:] == ["--verify-only"]
if not verify_only:
    assert os.environ.get("GITHUB_REF_NAME", "").startswith("site-sync-")
paths = []
for item in manifest["files"]:
    path = item["path"]
    assert re.fullmatch(r"public/images/knowledge-20261026/[a-z0-9-]+\.png", path)
    assert re.fullmatch(r"[0-9a-f]{40}", item["git_blob_sha"])
    target = ROOT / path
    assert not target.is_symlink()
    assert target.parent.resolve() == ROOT / "public/images/knowledge-20261026"
    if verify_only:
        data = target.read_bytes()
    else:
        chunks = item["chunks"]
        assert 0 < len(chunks) <= 100
        parts = []
        for chunk in chunks:
            assert re.fullmatch(r"\.openai/asset-chunks/[a-z0-9.-]+\.b64", chunk)
            chunk_path = ROOT / chunk
            assert not chunk_path.is_symlink() and chunk_path.parent.resolve() == ROOT / ".openai/asset-chunks"
            parts.append(base64.b64decode(chunk_path.read_bytes(), validate=True))
        data = b"".join(parts)
    assert len(data) <= 10 * 1024 * 1024 and data.startswith(b"\x89PNG\r\n\x1a\n")
    actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    assert actual == item["git_blob_sha"], path + ": asset does not match delivered source"
    if not verify_only:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    paths.append(path)
    print(path + ": verified " + actual)
if not verify_only:
    chunk_paths = [chunk for item in manifest["files"] for chunk in item["chunks"]]
    for path in chunk_paths:
        (ROOT / path).unlink()
    subprocess.run(["git", "add", "-A", "--", *paths, *chunk_paths], cwd=ROOT, check=True)
    changed = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=ROOT).returncode
    if changed:
        subprocess.run(["git", "-c", "user.name=github-actions[bot]", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com", "commit", "-m", "Import verified assets from published Site v" + str(manifest["sites_version"])], cwd=ROOT, check=True)
        subprocess.run(["git", "push", "origin", "HEAD:refs/heads/" + os.environ["GITHUB_REF_NAME"]], cwd=ROOT, check=True)
