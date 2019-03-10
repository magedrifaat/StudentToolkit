$(function() {
    //Powered by Wolfram Alpha API
    $("#graphBtn").click(function() {
        // adding a prefix to the input function to indicate real axes plotting
        var func = "real plot " + $("#function").val();
        if (func)
        {
            $("#resultHolder").html("<h2>Graphing...</h2>");
            // making the AJAX request to the back-end specifying a plot and its width
            $.getJSON("/wolfram",parameters = {'input': func, 'includepodid': 'Plot', 'plotwidth': 500})
            .done(function(data, textStatus, jqXHR) {
                result = edit(data);
                $("#resultHolder").html(result);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $("#resultHolder").html("<h2>Couldn't Graph. Try rechecking the input.</h2>");
            });
        }
    });
    $("#function").keydown(function(event)
    {
        // support for solving on Enter key
        if (event.which == 13)
        {
            $("#graphBtn").click();
        }
    });
});

function edit(data)
{
    // trying a recalculation using alternateData
    if (!(data && data["queryresult"]["pods"]))
    {
        data = alternateData(data);
        if (!(data && data["queryresult"]["pods"]))
        {
            return "<h2>Couldn't Graph. Try rechecking the input..</h2>";
        }
    }
    // returning the result as an HTML image
    var result = data["queryresult"]["pods"][0]["subpods"][0]["img"];
    return "<img src=" + result.src + " alt=" + result.alt + "/>";
}

function alternateData(olddata)
{
    // trying a recalculation
    $.getJSON(olddata["queryresult"]["recalculate"])
    .done(function(data, textStatus, jqXHR){
       return data;
    });
}