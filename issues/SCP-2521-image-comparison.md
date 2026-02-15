# SCP-2521 Image Comparison — Debug Report

## Step 1 — Wiki page: every visible image (in order)

Source: https://scp-wiki.wikidot.com/scp-2521

Images are listed in DOM order within the main article (excluding nav/sidebar). Filename derived from `src` (open in new tab = path’s last segment).

| # | Filename | Description (what it shows) | Visible on ours? |
|---|----------|-----------------------------|-------------------|
| 1 | scp_number.jpg | Large header image (contest image) | ✅ Yes (recovered) |
| 2 | camera_icon.png | Small camera icon in caption of header image | ✅ Yes (recovered) |
| 3 | scp.png | Small SCP logo (35px) next to title | ✅ Yes (in raw_content) |
| 4 | keter.png | Keter class icon (100px) | ✅ Yes (in raw_content) |
| 5 | lock2.png | Lock icon (110px) | ✅ Yes (recovered) |
| 6 | documents4.png | Documents icon (370px) | ✅ Yes (recovered) |
| 7 | clearance6.png | Clearance icon (475px) | ✅ Yes (recovered) |
| 8 | info.png | Info icon (75px) | ✅ Yes (recovered) |
| 9 | physical6.png | Physical icon (315px) | ✅ Yes (recovered) |
| 10 | intangible3.png | Intangible icon (350px) | ✅ Yes (recovered) |
| 11 | thought5.png | Thought icon (550px) | ✅ Yes (recovered) |
| 12 | test_logs.png | Test logs header (100px) | ✅ Yes (recovered) |
| 13 | a.png | “A” label (75px, left-aligned) | ✅ Yes (recovered) |
| 14 | test_a3.png | Test A image (660px) | ✅ Yes (recovered) |
| 15 | b.png | “B” label (75px, left-aligned) | ✅ Yes (recovered) |
| 16 | test_b2.png | Test B image (660px) | ✅ Yes (recovered) |

**Note:** The wiki also shows an avatar image (`avatar.php?userid=...`) in the license/collapsible block; our pipeline keeps it from `raw_content` (we do not strip it).

---

## Step 2 — Our page: every `<img>` inside `.scp-content`

After `recoverWikidotImages()` runs, the content has **17** `<img>` tags (order below). All use `src` of the form  
`https://scp-wiki.wdfiles.com/local--files/scp-2521/<filename>` except the avatar.

1. camera_icon.png  
2. scp_number.jpg  
3. scp.png  
4. keter.png  
5. lock2.png  
6. documents4.png  
7. clearance6.png  
8. info.png  
9. physical6.png  
10. intangible3.png  
11. thought5.png  
12. avatar.php?userid=... (from raw_content)  
13. test_logs.png  
14. a.png  
15. test_a3.png  
16. b.png  
17. test_b2.png  

So **all 16 article images from the wiki are present on ours**; the only extra is the avatar from the license block.

---

## Step 3 — Diff and syntax/source for each image

**Missing from ours:** **None.** Every wiki article image is present after recovery.

**Syntax / source in `raw_source` for SCP-2521:**

| Filename | In raw_content? | In raw_source? | Syntax / source |
|----------|------------------|----------------|------------------|
| scp_number.jpg | No | Yes | `[[include … component:image-block</a> name=scp_number.jpg|caption=[[image camera_icon.png …]]]]` — **Pattern B** (IMAGE_BLOCK_REGEX). Note: API returns `component:image-block` as linkified HTML `<a href="...">component:image-block</a>`. |
| camera_icon.png | No | Yes | Nested inside caption: `[[image camera_icon.png style="width:50px;"]]` — **Pattern A** (IMG_TAG_REGEX). |
| scp.png | Yes | Yes | `[[image scp.png style="margin: -10px 0px; width: 35px"]]` — in raw_content so not “recovered”. |
| keter.png | Yes | Yes | `[[image keter.png style="width:100px;"]]` — in raw_content so not recovered. |
| lock2.png | No | Yes | `[[=image lock2.png style="width:110px;"]]` — **Pattern A** (= center). |
| documents4.png | No | Yes | `[[=image documents4.png style="width:370px;"]]` — **Pattern A**. |
| clearance6.png | No | Yes | `[[=image clearance6.png style="width:475px;"]]` — **Pattern A**. |
| info.png | No | Yes | `[[=image info.png style="width:75px;"]]` — **Pattern A**. |
| physical6.png | No | Yes | `[[=image physical6.png style="width:315px;"]]` — **Pattern A**. |
| intangible3.png | No | Yes | `[[=image intangible3.png style="width:350px;"]]` — **Pattern A**. |
| thought5.png | No | Yes | `[[=image thought5.png style="width:550px;"]]` — **Pattern A**. |
| test_logs.png | No | Yes | `[[=image test_logs.png style="width:100px;"]]` — **Pattern A**. |
| a.png | No | Yes | `[[<image a.png style="width:75px;"]]` — **Pattern A** (< left). |
| test_a3.png | No | Yes | `[[=image test_a3.png style="width:660px;"]]` — **Pattern A**. |
| b.png | No | Yes | `[[<image b.png style="width:75px;"]]` — **Pattern A**. |
| test_b2.png | No | Yes | `[[=image test_b2.png style="width:660px;"]]` — **Pattern A**. |

**Conclusion:**  
- No images are missing; the current recovery patterns (A = `[[[=<>]?]image filename style="..."]`, B = `[[include ... component:image-block ... name=filename]]`) cover every image on the wiki for SCP-2521.  
- The only oddity is **API `raw_source`** containing HTML in the include: `[[include <a href="/component:image-block">component:image-block</a> name=scp_number.jpg|...]]`. Our IMAGE_BLOCK_REGEX still matches because it allows `[\s\S]*?` between `include` and `component:image-block` and between `component:image-block` and `name=`.

If something still looks “not done” on your side, likely causes are:
1. **Order/placement** — we insert recovered images by segment (before each `<hr>`); wiki order may differ (e.g. camera_icon as caption of scp_number vs our separate block).  
2. **Sanitizer** — DOMPurify or our sanitize step might be stripping an attribute or wrapper on your build.  
3. **Cache** — ensure the client is getting the latest bundle that runs `recoverWikidotImages` and that React Query isn’t serving stale content.
