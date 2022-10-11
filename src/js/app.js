// Variables
var checkedReasons = {};
const supportTableValues = {
  traceBulk:
    "My system needs to be able to trace bulk products. <br /><small class='text-muted'>Eg. Tracing bins of product along the supply chain from farm to food transformation.</small>",
  individualPackage:
    "My system needs to be able to trace individually packaged products.<br /><small class='text-muted'>Eg. Tracing packaged products along the supply chain from point of food transformation to retailer or consumer.</small>",
  wetCold:
    "My system needs to be suitable for use in wet or cold production and processing environments.<br /><small class='text-muted'>Eg. When packaged, my product may be exposed to wet and/or varying temperature-controlled environments which may lead to stickers not adhering or labels deteriorating.</small>",
  otherCountries:
    "My system needs to be compatible with data standards in other countries.<ul><li>If so, specify which countries your business is exporting to and if known, what data standards are used by your buyer.</li></ul><small class='text-muted'>E.g. Linked to global data standards, such as GS1. It’s important the standards used along the supply chain are interoperable (meaning: data is collected, stored and shared to communicate with other systems along the supply chain. Some systems may use different software but will be able to connect seamlessly).</small>",
  nonEnglish:
    "My product labelling needs to be written in languages other than English.<ul><li>If so, specify which countries and languages.</li></ul>",
  otherRequirements:
    "Other requirements specific to my business may include:<br />(List any that apply in the comments column, here are some examples)<ul><li>My product is subject to Xray screening, and this may damage digital loggers</li><li>Airfreight/seafreight approval is part of my supply chain process</li><li>My product is often subject to additional stickering by other business along the supply chain for transport and logistics purposes</li><li>Logging temperature during transport is essential for demonstrating food safety/customer compliance along the supply chain</li></ul>",
};

// functions
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

function collateT1Reasons() {
  checkedReasons = {
    foodSafe: $("#t1foodSafe").prop("checked") == true,
    marketAccess: $("#t1marketAccess").prop("checked") == true,
    biosecurity: $("#t1biosecurity").prop("checked") == true,
    provenance: $("#t1provenance").prop("checked") == true,
    certifications: $("#t1certifications").prop("checked") == true,
    productivity: $("#t1productivity").prop("checked") == true,
  };

  //update tree 2 values
  for (i in checkedReasons) {
    $("#" + i).prop("checked", checkedReasons[i]);
  }

  // Check in any checked
  var anyChecked = false;
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

function collateT2Reasons() {
  checkedReasons = {
    foodSafe: $("#foodSafe").prop("checked") == true,
    marketAccess: $("#marketAccess").prop("checked") == true,
    biosecurity: $("#biosecurity").prop("checked") == true,
    provenance: $("#provenance").prop("checked") == true,
    certifications: $("#certifications").prop("checked") == true,
    productivity: $("#productivity").prop("checked") == true,
  };

  // Check in any checked
  var anyChecked = $("#notImportant").prop("checked");
  for (const i in checkedReasons) {
    anyChecked = anyChecked || checkedReasons[i];
  }

  if (anyChecked == true) {
    $("#t2Continue").removeClass("disabled");
  } else {
    $("#t2Continue").addClass("disabled");
  }
}

function transitionTables() {
  $("#tree1Row").hide();
  $("#tree1Row").attr("aria-hidden", "true");
  $("#tree2Row").show();
  $("#tree2Row").attr("aria-hidden", "false");
  collateT2Reasons();
}

function resetForms() {
  $("#important-tab").tab("show");
  $("#start-tab").tab("show");
  $(".form-check-input").prop("checked", false);
  $("#t2Continue").addClass("disabled");
  $("#dt2startButton").addClass("disabled");
  $("textarea").val("");
}

function toggleNotImportant() {
  if (this.id == "notImportant") {
    $(
      "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity"
    ).prop("checked", false);
  } else {
    $("#notImportant").prop("checked", false);
  }
}

function t2Continue() {
  if ($("#notImportant").prop("checked") == true) {
    $("#exit-tab").tab("show");
  } else {
    $("#support-tab").tab("show");
  }
}

function populateTables() {
  for (const i in supportTableValues) {
    var newRow = `<tr> <td> ${supportTableValues[i]} </td> <td> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="${i}" id="${i}Yes" value="true" /> <label class="form-check-label" for="${i}Yes" >Yes</label > </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="${i}" id="${i}No" value="false" /> <label class="form-check-label" for="${i}No" >No</label > </div> </td> <td> <div class="form-floating" style = "min-width: 15rem;"> <textarea class="form-control" placeholder="List your requirements here" id="${i}Requirements" ></textarea> <label for="${i}Requirements">Requirements</label> </div> </td> </tr> `;
    $("#supportTable>tbody").append(newRow);
  }
}

// On loaded
$(function () {
  //Add listeners
  $(
    "#t1foodSafe, #t1marketAccess, #t1biosecurity, #t1provenance, #t1certifications, #t1productivity"
  ).change(collateT1Reasons);
  $(
    "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity, #notImportant"
  ).change(toggleNotImportant);
  $(
    "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity, #notImportant"
  ).change(collateT2Reasons);
  // Populate tables
  populateTables();
});
