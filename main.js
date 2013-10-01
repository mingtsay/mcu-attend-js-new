/* MCU Attend, Version 0.9.4 */
/* This script release under LGPL License */

var mcu_attend_version = "0.9.4";

/* jQuery from stackoverflow: 8139794 */
var loadJQ = function (onload) {
    if (typeof jQuery !== 'undefined') {
        onload();
    } else {
        var head = document.getElementsByTagName('head')[0];
        var jq = document.createElement('script');
        jq.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';
        jq.type = 'text/javascript';
        jq.onload = jq.onreadystatechange = function() {
            if (jq.readyState) {
                if (jq.readyState === 'complete' || jq.readyState === 'loaded') {
                    jq.onreadystatechange = null;
                    onload();
                }
            } else onload();
        };
        head.appendChild(jq);
    }
};

/* Sound from stackoverflow: 17762763 */
var Sound = (function () {
    var df = document.createDocumentFragment();
    return function Sound(src) {
        var snd = new Audio(src);
        df.appendChild(snd); // keep in fragment until finished playing
        snd.addEventListener('ended', function () {df.removeChild(snd);});
        snd.play();
        return snd;
    }
}());

/* CSS from stackoverflow: 524696 */
var loadCSS = function (csstext) {
    var head = document.getElementsByTagName('head')[0];
    var mycss = document.createElement("style");
    mycss.type = 'text/css';
    if (mycss.styleSheet) {
        mycss.styleSheet.cssText = csstext;
    } else {
        mycss.appendChild(document.createTextNode(csstext));
    }
    head.appendChild(mycss);
}

var playSound = function (sid, name) {
    var s = new Sound("http://mt.rmstudio.tw/mcu_attend/wave.php?sid=" + sid + "&name=" + name + "&dummy=" + (new Date().getTime()));
};

var regen = function(sid) {
    var s = new Sound("http://mt.rmstudio.tw/mcu_attend/wave.php?regen&sid=" + sid + "&dummy=" + (new Date().getTime()));
}

var change = function(sid, name) {
    name = window.prompt("請輸入欲修改之語音內容：", name);
    var s = new Sound("http://mt.rmstudio.tw/mcu_attend/wave.php?regen&sid=" + sid + "&name=" + name + "&dummy=" + (new Date().getTime()));
};

var nowid = "";

loadJQ(function () {
    if ($("form #mcu_attend").length) {
        window.alert("唱名程式已載入，若要重新載入請重新整理頁面！");
        return;
    }

    loadCSS("" +
        "#mcu_attend {" +
            "text-align: center;" +
            "padding: 5px;" +
            "margin: 5px;" +
            "background: #66f;" +
            "color: #ff6;" +
        "}" +
        "#mcu_attend a {" +
            "color: #fcf;" +
            "text-decoration: none;" +
        "}" +
        "#mcu_attend a:hover {" +
            "color: #fff;" +
        "}" +
        "form td:hover {" +
            "background: #FFE1FF;" +
        "}" +
        "div.function_buttons {" +
            "text-align: center;" +
            "visibility: hidden;" +
        "}" +
        "form td:hover div.function_buttons {" +
            "visibility: visible;" +
        "}" +
    "");

    if($("form td").length == 0) {
        window.alert("唱名系統載入失敗，請確認您所開啟的頁面是否為銘傳的點名考勤系統！");
        return;
    }

    $("form td").mouseover(function() {
        var sid = $(this).find("font")[1].innerHTML;
        var name = $($(this).find("font")[0]).text().substr(sid.length).trim();
        if (nowid != sid) {
            playSound(sid, name);
            nowid = sid;
        }
    }).each(function() {
        var sid = $(this).find("font")[1].innerHTML;
        var name = $($(this).find("font")[0]).text().substr(sid.length).trim();
        var btn_replay = "<a href=\"javascript:playSound('" + sid + "', '" + name + "');\"><img width=\"16px\" height=\"16px\" src=\"http://mt.rmstudio.tw/mcu_attend/images/replay.png\" title=\"重新播放音訊檔案\" alt=\"replay\" /></a>";
        var btn_regen = "<a href=\"javascript:regen('" + sid + "');\"><img width=\"16px\" height=\"16px\" src=\"http://mt.rmstudio.tw/mcu_attend/images/regen.png\" title=\"重新產生音訊檔案\" alt=\"regen\" /></a>";
        var btn_change = "<a href=\"javascript:change('" + sid + "', '" + name + "');\"><img width=\"16px\" height=\"16px\" src=\"http://mt.rmstudio.tw/mcu_attend/images/change.png\" title=\"修改發音內容\" alt=\"change\" /></a>";
        $(this).append($("<div class=\"function_buttons\">" + btn_change + "&nbsp;" + btn_regen + "&nbsp;" + btn_replay + "</div>"));
    });

    $("form").prepend("<div id=\"mcu_attend\">外掛已載入：<a href=\"http://mt.rmstudio.tw/mcu_attend\" target=\"_blank\" title=\"瀏覽唱名程式專案網頁（另開新視窗）\">唱名程式</a> v" + mcu_attend_version + " Developed by Ming Tsay. 2013</div>");

    window.alert(
        "唱名程式 v" + mcu_attend_version + "已成功載入！\n\n" +
        "使用方法：\n僅需將滑鼠移動至學生姓名上方即可。\n\n" +
        "障礙排除：\n" +
        "若唸出來的發音錯誤，可點選「修改發音內容」以同音字來發音。\n" +
        "若無法正常唸出姓名，可點選「重新播放音訊檔案」或「重新產生音訊檔案」。\n\n" +
        "本程式以 LGPL v3.0 授權釋出，請依授權指示來使用本程式。\n" +
        "Developed by Ming Tsay. 2013"
    );
});

