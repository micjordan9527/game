from pathlib import Path
import argparse, json, string
from fontTools import subset
from fontTools.ttLib import TTFont

p=argparse.ArgumentParser()
p.add_argument('--project', default='.')
p.add_argument('--output', required=True)
a=p.parse_args()
project=Path(a.project).resolve()
out=Path(a.output).resolve(); out.mkdir(parents=True, exist_ok=True)
source=Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc')
license_source=Path('/usr/share/doc/fonts-noto-cjk/copyright')
text=(project/'src/app/opengraph-image.tsx').read_text()
extra='包网知识库：案例、功能图解与界面示例。实际演示 后台系统 结构图解 工作模板 术语速查 文章 流程图 移动端 状态对照'
chars=set(string.printable+'·，、：。'+extra+''.join(c for c in text if ord(c)>=0x2e80))
font=TTFont(source,fontNumber=2)
missing=sorted(c for c in chars if ord(c) not in font.getBestCmap() and not c.isspace())
assert not missing, missing
options=subset.Options()
options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
options.layout_features=[]
s=subset.Subsetter(options=options);s.populate(text=''.join(sorted(chars)));s.subset(font)
family='BaowangKnowledgeOG'
postscript=family+'-Bold'
names={1:family,2:'Bold',3:postscript+'-Subset-20261026',4:family+' Bold Subset',6:postscript,16:family,17:'Bold'}
for record in font['name'].names:
 if record.nameID in names:
  record.string=names[record.nameID].encode(record.getEncoding(),errors='replace')
if 'CFF ' in font:
 font['CFF '].cff.fontNames[0]=postscript
 top=font['CFF '].cff.topDictIndex[0]
 top.FamilyName=family;top.FullName=family+' Bold Subset'
filename='baowang-knowledge-og-bold.otf'
font.save(out/filename)
(out/'OFL-and-copyright.txt').write_text(license_source.read_text())
check=TTFont(out/filename)
coverage=check.getBestCmap()
missing=sorted(c for c in chars if ord(c) not in coverage and not c.isspace())
assert not missing,missing
manifest={'file':filename,'family':family,'style':'normal','weight':700,'format':'OpenType CFF','bytes':(out/filename).stat().st_size,'source':'Debian fonts-noto-cjk: NotoSansCJK-Bold.ttc, Simplified Chinese face 2','upstream':'https://github.com/notofonts/noto-cjk','license':'SIL Open Font License 1.1; see OFL-and-copyright.txt','modifications':'Subset to current Open Graph Chinese text, ASCII and a small set of neutral knowledge-base labels; derivative family renamed BaowangKnowledgeOG. No font download.','characters':''.join(sorted(c for c in chars if not c.isspace())),'glyph_count':len(check.getGlyphOrder()),'missing_characters':missing}
(out/'font-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'file':str(out/filename),'bytes':manifest['bytes'],'glyph_count':manifest['glyph_count'],'missing':missing},ensure_ascii=False))
