$(function() {
    //Powered by WolframAlpha API
    $("#solveBtn").click(function() {
        // getting input equation
        var equation = $("#equation").val();
        if (equation)
        {
            // adding a "= 0" if no equal sign is provided
            equation += equation.indexOf("=") > -1? "" : "= 0";
            $("#resultHolder").html("<h2>Solving...</h2>");
            var result = "";

            // AJAX request to Wolfram specifying the equation and the format and limiting the response to 'Solution'
            $.getJSON("/wolfram",parameters = {'input': equation, 'includepodid': 'Solution'})
            .done(function(data, textStatus, jqXHR) {
                result = edit(data);
                $("#resultHolder").html(result);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $("#resultHolder").html("<h2>Couldn't solve. Try rechecking the input.</h2>");
            });
        }
    });

    $("#equation").keypress(function(event)
    {
        // support for solving on Enter key
        if (event.which == 13)
        {
            $("#solveBtn").click();
        }
    });
});

function edit(data)
{
    var result = "";
    // trying to recalculate using alternateData if data is empty
    if (!data || data["queryresult"]["numpods"] == 0)
    {
        data = alternateData(data);
        if (!data || data["queryresult"]["numpods"] == 0)
        {
            return "<h2>Couldn't solve. Try rechecking the input.</h2>";
        }
    }

    var solutions = [];
    var pods = data["queryresult"]["pods"];
    for (var i = 0; i < pods.length; i++)
    {
        subpods = pods[i]["subpods"];
        // looping through the different solutions
        for (var subpod of subpods)
        {
            // formatting 'i's and 'x's in the result
            solutions.push(subpod.plaintext.replace(/i/gi,"𝑖").replace(/x/gi,"𝑥").replace(/~~/gi,"≈"));
        }

    }

    for (var i = 0; i < solutions.length; i++)
    {
        // populating result with the solutions
        result += "<h2>" + solutions[i];
        result += i == solutions.length - 1? "" : " , or";
        result += "</h2>";
    }
    return result;
}

function alternateData(olddata)
{
    // trying a recalculation
    $.getJSON(olddata["queryresult"]["recalculate"])
    .done(function(data, textStatus, jqXHR){
       return data;
    })
    .fail(function(){
        return null;
    });
}