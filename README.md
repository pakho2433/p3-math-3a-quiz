# 三上A 數學打怪問答

小學三年級數學（上學期 A 冊）問答溫習遊戲。答啱就擊殺怪獸，英雄會解鎖新武器同裝備。

GitHub Pages 會 cache 靜態檔。每次發佈請更新 `index.html` 的 `?v=` query，首頁有「畫面 v*」標記方便核對。

硬刷新：iPad Safari 長按重新整理 → 重新載入並清除快取；或關閉分頁再開。桌面可用 Cmd/Ctrl+Shift+R。

## 作為模板

題目全部放在 `questions.json`。之後做其他科目（例如五年級人文）時，複製此 repo、只換題目與標題即可：欄位用 `q`、`options`、`answer`、`source`、`explain`、`lesson`、`topic`，填數字題加 `type: "input"` 同 `answerValue`。
