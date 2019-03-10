$(function() {
    //Powered by languagetool API
    $("#grammarBtn").click(function() {
        // getting the text entered
        var text = $("#inTxt").val();
        if (text)
        {
            var result = "";
            // making the AJAX request to the API directly and specifying the text language
            $.getJSON("https://languagetool.org/api/v2/check", parameters = {text: text, language: 'en'})
                .done(function(data, textStatus, jqXHR) {
                    result = edit(text,data);
                    $("#outTxt").html(result);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    $("#outTxt").html("error");
                });
        }
    });
});

function edit(text , data)
{
    var result = "";
    // adding character by character and replacing words with matched ones
    for (var i = 0; i < text.length; i++)
    {
        flag = false;
        var word = "";
        var skip = 0;
        // looping through all results to see if one of them replaces current word
        for (item of data["matches"])
        {
            if (i == parseInt(item["offset"]))
            {
                flag = true;
                skip = parseInt(item["context"]["length"]) - 1;
                word = "<strong>" + item["replacements"][0]["value"] + "</strong>";
            }
        }
        if (flag)
        {
            // replacing current word with the new word and skipping over it
            result += word;
            i += skip;
        }
        else
        {
            // adding current character normally
            result += text[i];
        }
    }
    return result;
}