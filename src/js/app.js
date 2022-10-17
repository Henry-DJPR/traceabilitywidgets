import * as XLSX from "xlsx";

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

// Tree selectors
function goTree1() {
  $("#tree1Row").show();
  $("#tree1Row").attr("aria-hidden", "false");
  $("#tree2Row").hide();
  $("#tree2Row").attr("aria-hidden", "true");
  resetForms();
}
function goTree2() {
  transitionTrees();
  resetForms();
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

function recodeTableId(text) {
  return text
    .replace("supportTable", "Q2")
    .replace("intBus", "Q3.1")
    .replace("custBus", "Q3.2")
    .replace("digitalNeeds", "Q4")
    .replace("accessNeeds", "Q5");
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

function transitionTrees() {
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
  $("#resultsTables").children().remove();
  $("#resultsTables").hide();
  populateTables();
  resultsCompiled = false;
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

function appendTable(table) {
  var newTable = $(table)
    .parent()
    .clone()
    .attr("id", $(table).attr("id") + "Results");
  $("#resultsTables").append(newTable);
}

function compileResults() {
  $("#resultsTables").append(`
  <table class = "table" id = "Q1">
  <thead>
  <tr>
  <th scope = "col">
  Driver
  </th>
  </tr>
  </thead>
  <tbody>
  </tbody>
  </table>
  `);

  for (const i in checkedReasons) {
    if (checkedReasons[i] === true) {
      $("#resultsTables>#Q1>tbody").append(
        `<tr><td>${recodeReasons(i)}</td></tr>`
      );
    }
  }

  $("#tree2Row .tab-pane")
    .not("#results")
    .find("table")
    .each(function () {
      var newTable = $(this)
        .clone()
        .attr("id", recodeTableId($(this).attr("id")));
      $("#resultsTables").append(newTable);
    });

  $("#resultsTables")
    .find("table")
    .each(function () {
      makeTableStatic($(this));
    });

  wbURL = new URL("../data/Traceability_tree_2.xlsx", import.meta.url);
  const out = fetch(wbURL)
    .then((resp) => resp.arrayBuffer())
    .then(function (buff) {
      const workbook = XLSX.read(buff);
      $("#resultsTables")
        .find("table")
        .each(function () {
          var id = this.id;
          var thisTable = XLSX.utils.table_to_sheet(this);
          XLSX.utils.book_append_sheet(workbook, thisTable, id);
        });
      XLSX.writeFile(workbook, "Traceability_results.xlsx");
    })
    .catch((err) => console.error(err));
}

// On loaded
$(function () {
  //Initial tree selection and input query selectors
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  if (params.tree === "1") {
    //Leave as is
  } else if (params.tree === "2") {
    $("#tree1Row").hide();
    $("#tree1Row").attr("aria-hidden", "true");
    $("#tree2Row").show();
    $("#tree2Row").attr("aria-hidden", "false");
  } else if (params.margin == undefined) {
    $("#developerOptions").show();
    $("#tree1Row>.col").removeClass("m-0");
    $("#tree2Row>.col").removeClass("m-0");
    $("#tree1Row>.col").removeClass("p-0");
    $("#tree2Row>.col").removeClass("p-0");
    $("#tree1Row>.col").addClass("p-4");
    $("#tree2Row>.col").addClass("p-4");
  } else {
    $("#developerOptions").show();
  }

  if (params.margin === "true") {
    $("#tree1Row>.col").removeClass("m-0");
    $("#tree2Row>.col").removeClass("m-0");
    $("#tree1Row>.col").addClass("p-4");
    $("#tree2Row>.col").addClass("p-4");
  }

  if (params.tree1width != undefined) {
    console.log("madeit");
    $("#tree1Row .card").css("max-width", params.tree1width);
  }

  if (params.tree2width != undefined) {
    $("#tree2Row .card").css("max-width", params.tree2width);
  }

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
  $("#nextTable").click(transitionTrees);
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

  //results listener
  $("#downloadResults").click(compileResults);

  // Populate tables
  populateTables();

  // Add new row listeners
  $("#intBusNewRow").click(addIntBusRow);
  $("#custBusNewRow").click(addCustBusRow);
  $("#digitalNeedsNewRow").click(addDigitalBusRow);
  $("#accessNeedsNewRow").click(addAccessNeedsRow);

  //DEV
  $("#btn-goTree2").click(goTree2);
  $("#btn-goTree1").click(goTree1);
});
