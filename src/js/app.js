// Variables
var checkedReasons = {};
const supportTableValues = {
  traceBulk:
    "My system needs to be able to trace bulk products.<span class='extras'><br /><small class='text-muted'>Eg. Tracing bins of product along the supply chain from farm to food transformation.</small></span>",
  individualPackage:
    "My system needs to be able to trace individually packaged products.<span class='extras'><br /><small class='text-muted'>Eg. Tracing packaged products along the supply chain from point of food transformation to retailer or consumer.</small></span>",
  wetCold:
    "My system needs to be suitable for use in wet or cold production and processing environments.<span class='extras'><br /><small class='text-muted'>Eg. When packaged, my product may be exposed to wet and/or varying temperature-controlled environments which may lead to stickers not adhering or labels deteriorating.</small></span>",
  otherCountries:
    "My system needs to be compatible with data standards in other countries.<span class='extras'><ul><li>If so, specify which countries your business is exporting to and if known, what data standards are used by your buyer.</li></ul><small class='text-muted'>E.g. Linked to global data standards, such as GS1. It’s important the standards used along the supply chain are interoperable (meaning: data is collected, stored and shared to communicate with other systems along the supply chain. Some systems may use different software but will be able to connect seamlessly).</small></span>",
  nonEnglish:
    "My product labelling needs to be written in languages other than English.<span class='extras'><ul><li>If so, specify which countries and languages.</li></ul></span>",
  otherRequirements:
    "Other requirements specific to my business may include<span class='extras'>:<br />(List any that apply in the comments column, here are some examples)<ul><li>My product is subject to Xray screening, and this may damage digital loggers</li><li>Airfreight/seafreight approval is part of my supply chain process</li><li>My product is often subject to additional stickering by other business along the supply chain for transport and logistics purposes</li><li>Logging temperature during transport is essential for demonstrating food safety/customer compliance along the supply chain</li></ul></span>",
};

// Dev functions
function goTree1() {
  $("#tree1Row").show();
  $("#tree1Row").attr("aria-hidden", "false");
  $("#tree2Row").hide();
  $("#tree2Row").attr("aria-hidden", "true");
  resetForms();
}
function goTree2() {
  transitionTables();
  resetForms();
}
function limitWidth() {
  $("#tree1Row>.col").css("max-width", "600px");
  $("#tree2Row>.col").css("max-width", "600px");
}
function fullWidth() {
  $("#tree1Row>.col").css("max-width", "100%");
  $("#tree2Row>.col").css("max-width", "100%");
}

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
  window.scrollTo(0, 0);
  $("#important-tab").tab("show");
  $("#start-tab").tab("show");
  $(".form-check-input").prop("checked", false);
  $("#t2Continue").addClass("disabled");
  $("#dt2startButton").addClass("disabled");
  $("textarea").val("");
  $("input").val("");
  populateTables();
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
    window.scrollTo(0, 0);
    $("#exit-tab").tab("show");
  } else {
    window.scrollTo(0, 0);
    $("#support-tab").tab("show");
  }
}

function populateTables() {
  $("#supportTable>tbody").children().remove();
  for (const i in supportTableValues) {
    var newRow = `<tr> <td> ${supportTableValues[i]} </td> <td> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="${i}" id="${i}Yes" value="Yes" /> <label class="form-check-label" for="${i}Yes" >Yes</label > </div> <div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="${i}" id="${i}No" value="No" /> <label class="form-check-label" for="${i}No" >No</label > </div> </td> <td><textarea class="form-control" placeholder="requirements" id="${i}Requirements" style = "min-width: 15rem;"></textarea></td> </tr> `;
    $("#supportTable>tbody").append(newRow);
  }
}

function makeTableStatic(table) {
  table.find(".extras").remove();
  table.find("input.form-check-input:checked").each(function () {
    const input = $(this);
    const val = input.val();
    if (val === "No") {
      input.parent().parent().parent().remove();
    } else {
      input.parent().parent().html(val);
    }
  });
  table.find("input.form-check-input").each(function () {
    $(this).parent().parent().html("");
  });
  table.find("textarea").each(function () {
    $(this).parent().html($(this).val());
  });
  table.find("input[type='text']").each(function () {
    $(this).parent().html($(this).val());
  });
}

function addIntBusRow() {
  $("#intBus>tbody").append(`
  <tr>
    <td>
      <input
        type="text"
        placeholder="Business system"
        class="form-control"
      />
    </td>
    <td>
      <textarea
        class="form-control"
        style="min-width: 15rem"
      ></textarea>
    </td>
  </tr>
  `);
}

function addCustBusRow() {
  $("#custBus>tbody").append(`
  <tr>
    <td>
      <input
        type="text"
        placeholder="Company"
        class="form-control"
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Current business systems"
        class="form-control"
      />
    </td>
    <td>
      <textarea
        class="form-control"
        style="min-width: 15rem"
      ></textarea>
    </td>
</tr>
  `);
}

function addDigitalBusRow() {
  $("#digitalNeeds>tbody").append(`
  <tr>
    <td>
      <input
        type="text"
        placeholder="Person"
        class="form-control"
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Current capability"
        class="form-control"
      />
    </td>
    <td>
      <textarea
        class="form-control"
        style="min-width: 15rem"
      ></textarea>
    </td>
  </tr>
  `);
}

function addAccessNeedsRow() {
  $("#accessNeeds>tbody").append(`
  <tr>
    <td>
      <input
        type="text"
        placeholder="Purpose"
        class="form-control"
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="What data"
        class="form-control"
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Data source"
        class="form-control"
      />
    </td>
    <td>
      <textarea
        class="form-control"
        style="min-width: 15rem"
      ></textarea>
    </td>
  </tr>
  `);
}

function compileResults() {
  $("#supportTable, #intBus, #custBus, #digitalNeeds, #accessNeeds").each(
    function () {
      $("#resultsHidden").append(this);
    }
  );
  $("#resultsHidden")
    .children()
    .each(function () {
      makeTableStatic($(this));
    });
}

// On loaded
$(function () {
  //Add refresh listeners
  $("#refreshTree1").click(resetForms);
  $("#refreshTree2").click(resetForms);

  //Add navigation listeners
  $(".toDelivers").click(function () {
    window.scrollTo(0, 0);
    $("#delivers-tab").tab("show");
  });
  $(".toConsidering").click(function () {
    window.scrollTo(0, 0);
    $("#considering-tab").tab("show");
  });
  $(".toEmerging").click(function () {
    window.scrollTo(0, 0);
    $("#emerging-tab").tab("show");
  });
  $(".toReasons").click(function () {
    window.scrollTo(0, 0);
    $("#reasons-tab").tab("show");
  });
  $(".toNoaction").click(function () {
    window.scrollTo(0, 0);
    $("#noaction-tab").tab("show");
  });
  $(".toFit").click(function () {
    window.scrollTo(0, 0);
    $("#fit-tab").tab("show");
  });
  $("#dt2startButton").click(function () {
    window.scrollTo(0, 0);
    $("#dt2start-tab").tab("show");
  });
  $("#nextTable").click(transitionTables);
  $("#t2Continue").click(t2Continue);
  $("#toConnect").click(function () {
    window.scrollTo(0, 0);
    $("#connect-tab").tab("show");
  });
  $("#toDigital").click(function () {
    window.scrollTo(0, 0);
    $("#digital-tab").tab("show");
  });
  $("#toAccess").click(function () {
    window.scrollTo(0, 0);
    $("#access-tab").tab("show");
  });
  $("#toResults").click(function () {
    window.scrollTo(0, 0);
    $("#results-tab").tab("show");
  });

  //Add reason selector listeners
  $(
    "#t1foodSafe, #t1marketAccess, #t1biosecurity, #t1provenance, #t1certifications, #t1productivity"
  ).change(collateT1Reasons);
  $(
    "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity, #notImportant"
  ).change(toggleNotImportant);
  $(
    "#foodSafe, #marketAccess, #biosecurity, #provenance, #certifications, #productivity, #notImportant"
  ).change(collateT2Reasons);

  $("#btn-goTree2").click(goTree2);
  $("#btn-goTree1").click(goTree1);
  $("#btn-limitWidth").click(limitWidth);
  $("#btn-fullWidth").click(fullWidth);

  //results listener
  $("#downloadResults").click(compileResults);

  // Populate tables
  populateTables();

  // Add row listeners
  $("#intBusNewRow").click(addIntBusRow);
  $("#custBusNewRow").click(addCustBusRow);
  $("#digitalNeedsNewRow").click(addDigitalBusRow);
  $("#accessNeedsNewRow").click(addAccessNeedsRow);

  //DEV
  limitWidth();
});
