// Variables
var checkedReasons = {};

function recodeReasons(text) {
  return text
    .replace("#", "")
    .replace("foodSafe", "Food safety (descriptor for each)")
    .replace("marketAccess", "Market access")
    .replace("biosecurity", "Biosecurity")
    .replace("provenance", "Provenance (location)")
    .replace("certifications", "Product attributes and certifications")
    .replace("productivity", "Productivity and supply chain efficiency");
}
function asLi(text) {
  return "<li>" + text + "</li>";
}

function collateReasons() {
  var anyChecked = false;
  checkedReasons = {
    foodSafe: $("#foodSafe").prop("checked") == true,
    marketAccess: $("#marketAccess").prop("checked") == true,
    biosecurity: $("#biosecurity").prop("checked") == true,
    provenance: $("#provenance").prop("checked") == true,
    certifications: $("#certifications").prop("checked") == true,
    productivity: $("#productivity").prop("checked") == true,
  };

  for (const i in checkedReasons) {
    anyChecked = anyChecked || checkedReasons[i];
  }

  if (anyChecked == true) {
    // Generate list
    var outList = [];

    for (const i in checkedReasons) {
      if (checkedReasons[i] == true) {
        outList.push(asLi(recodeReasons(i)));
      }
    }

    $("#dt2startButton").removeClass("disabled");
    $("#interestedList").html(outList.join(""));
  } else {
    $("#dt2startButton").addClass("disabled");
    $("#interestedList").html("<li>Error</li>");
  }
}

// Add listeners
$(function () {
  $(
    "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity"
  ).change(collateReasons);
});
