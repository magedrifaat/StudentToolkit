$(function() {
    //Powered by Oxford Dictionary API
    $("#searchBtn").click(function() {
        var result = "";
        // getting input word
        var word = $("#word").val();
        if (word)
        {
            $("#vocabHolder").html("<h2 style='text-align:center'>Loading...</h2>");
            // making the AJAX request to the back-end
            $.getJSON("/search",parameters = {word: word})
            .done(function(data, textStatus, jqXHR) {
                result = edit(data);
                $("#vocabHolder").html(result);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $("#vocabHolder").html("<h2 style='text-align:center'>No Result Found</h2>");
            });

        }
    });

    $("#word").keydown(function(event)
    {
        // support for search on clicking Enter key
       if (event.which == 13)
       {
           $("#searchBtn").click();
       }
    });
});

function edit(data)
{
    var result = "";
    var word = data["results"][0]["id"];
    // looping over all the resulted entries
    for (var entry of data["results"][0]["lexicalEntries"])
    {
        // adding the entry with all its senses in a formatted way
        result += "<h1><span>" + word + "</span><span style='font-size:50%'> (" + entry["lexicalCategory"] + ")</span></h1><h3><b>Definitions:</b></h3>";
        for (var sense of entry["entries"][0]["senses"])
        {
            // adding the definitions of each sense
            result += sense["definitions"]? "<h3>-" + sense["definitions"][0] + "</h3>": "<h3>-" + sense["crossReferenceMarkers"][0] + "</h3>";
            result += sense["examples"]?"<h3><b>Examples:</b></h3>":"";
            for (var example in sense["examples"])
            {
                result += "<h3 style='margin-left:40px;font-size:150%;'>-" + sense["examples"][example]["text"] + "</h3>";
            }
            result += "<br>";
        }
    }
    return result;
}