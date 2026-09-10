# Taixuan 太玄经注释与占卜

本项目包含两部分：

- `web/`：GitHub Pages 可直接预览的静态网页应用，包含占卜、浏览、注释和记录功能。
- `taixuan-jing/`：注释页生成工具与原始数据脚本。

## 本地预览

1. 确保 `taixuan.txt` 位于仓库根目录，并确认是 UTF-16 编码。
2. 生成注释页：

   ```bash
   python3 taixuan-jing/gen_html.py
   ```

   生成结果会写入 `web/annotations.html`。

3. 启动静态服务器：

   ```bash
   cd web
   python3 -m http.server 8000
   ```

4. 浏览器打开：
   - 占卜应用：`http://localhost:8000/`
   - 八十一首注释：`http://localhost:8000/annotations.html`

## GitHub Pages

在仓库设置中配置 Pages：

- Source：`Deploy from a branch`
- Branch：默认分支
- Folder：`/web`

如果本地源文本发生变化，重新运行 `gen_html.py`，然后提交 `web/annotations.html` 与 `web/_shared/fonts/`。
