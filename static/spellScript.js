$(function() {
    //Powered by bing spell check API
    $("#splBtn").click(function() {
        // getting input text
        var text = $("#inTxt").val();
        if (text)
        {
            var result = "";
            // key to the API
            var key = 'a24a331650d24aa083452e63ec2bc157';
            // API requires an HTTP headers, AJAX produces many issues XMLHTTPRequest is used instead
            var request = new XMLHttpRequest();
            // creating the request with the correct get arguments
            request.open("POST", "https://api.cognitive.microsoft.com/bing/v7.0/spellcheck/?mode=proof&mkt=en-US&text=" + encodeURIComponent(text.replace(/\n/g,'*')));
            // setting the key in the header
            request.setRequestHeader("Ocp-Apim-Subscription-Key", key);
            request.addEventListener("load", function() {
                if (this.status === 200) {
                    data = JSON.parse(this.responseText);
                    result = edit(text,data);
                    $("#outTxt").html(result);
                }
                else {
                    $("#outTxt").text('error');
                }
            });
            request.send();
        }
    });
});

function edit(text , data)
{
    var result = "";
    // looping through the text to replace misspelled words with suggestions
    for (var i = 0; i < text.length; i++)
    {
        flag = false;
        var word = "";
        var skip = 0;
        // checking if any of the suggestion starts at the current caharacter
        for (item of data["flaggedTokens"])
        {
            if (i == parseInt(item["offset"]))
            {
                flag = true;
                skip = item["token"].length - 1;
                // getting the suggestion with the maximum score
                var maxScore = 0;
                for (sugg of item["suggestions"])
                {
                    if (sugg["score"] > maxScore)
                    {
                        maxScore = sugg["score"];
                        word = "<strong>"+sugg["suggestion"] + "</strong>";
                    }
                }
            }
        }
        if (flag)
        {
            // add the word and skip the misspelled one
            result += word;
            i += skip;
        }
        else
        {
            // add the character normally
            result += text[i];
        }
    }
    return result;
}