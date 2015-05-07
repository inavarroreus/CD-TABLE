/*** MOVE SLIDER ***/
$( document ).ready(function() {
  var numberOfLis = $(".slider .row.header .cell").length;
  //moveSlider(numberOfLis);

  function moveSlider(times){
    console.log(times);
    var moreTimes = times - 1;
    setTimeout(function(){
      $( ".slider" ).animate({
        left: "-=1024"
      }, 500, function() {
        if(moreTimes > 0){
          moveSlider(moreTimes);
        }
      });
    }, 5000);
  }

  //Build table
  var numberOfColumns = insertHeader(mock);
  insertJob(mock[0], numberOfColumns);
  insertJob(mock[1], numberOfColumns);
});


/**** BUILD TABLE ***/
function insertJob(job, numberOfColumns){
  insertJobidRow(job);
  insertRow(job, numberOfColumns);
}

function insertRow(job, numberOfColumns){
  var row = generateRow(job, numberOfColumns);
  var slider = document.getElementById("slider");
  slider.appendChild(row);

};

function insertHeader(arrayOfJobs){
  var stagesTitles = getStagesTitles(arrayOfJobs);
  var domHeader = getDomHeader(stagesTitles);
  document.getElementById("slider").appendChild(domHeader);
  return stagesTitles.length;
}

function insertJobidRow(job){
  var day = moment(job.end_date).format("D MMMM");
  var hour = moment(job.end_date).format("HH:mm");
  var rowDiv = document.createElement("div");
  rowDiv.className = "row " + getRowClass(job.result);
  var cell = document.createElement("div");
  cell.className = "cell np";
  var jobId = document.createElement("div");
  jobId.className = "job";
  jobId.innerHTML = "#" + job.job;
  var dateTime = document.createElement("div");
  dateTime.className = "datetime";
  var day = document.createElement("span");
  day.className = "day";
  var time = document.createElement("span");
  time.className = "time";
  day.innerHTML = day;
  time.innerHTML = hour;
  dateTime.appendChild(day);
  dateTime.appendChild(time);
  cell.appendChild(jobId);
  cell.appendChild(dateTime);
  rowDiv.appendChild(cell);
  document.getElementById("ids").appendChild(rowDiv);
};



/*****************/
/** TABLE HEAD ***/
/*****************/
function getStagesTitles(arrayOfJobs){
  var stagesTitles = [];
  for (var i = 0; i < arrayOfJobs.length; i++) {
    for (var j = 0; j < arrayOfJobs[i].stages.length; j++) {
      stagesTitles.pushIfNotExist( arrayOfJobs[i].stages[j].stage);
    }
  }
  return stagesTitles;
}

function getDomHeader(stagesNames){
  var header = document.createElement("div");
  header.className = "row header";
  for (var i = 0; i < stagesNames.length; i++) {
    var cell = document.createElement("div");
    cell.className = "cell";
    cell.innerHTML = stagesNames[i];
    header.appendChild(cell);
  }
  return header;
};

function getStagesNames(job){
  var names = new Array();
  for (var i = 0; i < job.stages.length; i++) {
    names.push(job.stages[i].stage);
  }
  return names;
}


/*****************/
/*   JOB ROWS    */
/*****************/
function generateRow(job, numberOfColumns){
  var stagesCells = getStageCells(job.stages);
  var rowClass = getRowClass(job.result);
  var rowContainer = document.createElement("div");
  rowContainer.className = "row " + rowClass;
  for (var i = 0; i < stagesCells.length; i++) {
    rowContainer.appendChild(stagesCells[i]);
  }
  console.log(job.result);
  if(job.result === "KO"){
    var numberOfEmptyCells = numberOfColumns - job.stages.length;
    console.log(numberOfColumns);
    insertEmptyStageCells(getEmptyStageCells(numberOfEmptyCells), rowContainer);
  }
  return rowContainer;
};

function getStageCells(arrayOfStages){
  var domStages = new Array();
  for (var i = 0; i < arrayOfStages.length; i++) {
    domStages.push(getStageCell(arrayOfStages[i]));
  }
  return domStages;
}

function getRowClass(jobResult){
  switch  (jobResult){
    case "OK" : return "successful";
    case "KO" : return "error";
    default   : return "working";
  }
}

function insertEmptyStageCells(arrayEmptyCells, row){
  for (var i = 0; i < arrayEmptyCells.length; i++) {
    row.appendChild(arrayEmptyCells[i]);
  };
}

function getEmptyStageCells(numberOfCells) {
  var cells = [];
  for (var i = 0; i < numberOfCells; i++) {
    var div = document.createElement("div");
    div.className = "cell empty"
    div.innerHTML = "----"
    cells.push(div);
  }
  console.log(cells);
  return cells;
}

/*** STAGE CELLS ***/
function getStageCell(stage){
  var div = document.createElement("div");
  div.className = "cell " + getStageCellClass(stage);

  var momentObjectElapsedTime = getStageElapsedTime(stage);
  var minutes = momentObjectElapsedTime.format("m");
  var secs = momentObjectElapsedTime.format("s");
  div.innerHTML = minutes + "<span>m</span> " + secs + "<span>s</span>" ;
  if(stage.status === null){
    var iconDiv = document.createElement("div");
    iconDiv.className = "icon";
    var icon = document.createElement("i");
    icon.className = getIconStageClass(stage.result);
    iconDiv.appendChild(icon);
    div.appendChild(iconDiv);
  }
  return div;
}


function getStageCellClass(stage){
  switch (stage.result){
    case "OK" : return "successful";
    case "KO" : return "error";
    default   : return "working";
  }
}

/**
 * Return the elapsedTime
 * @param stage
 * @returns {*} moment object
 */
function getStageElapsedTime(stage){
  var from = moment(stage.start_date);
  var to = moment(stage.end_date);
  return moment(to.diff(from));
}



function getIconStageClass(stageClass){
  switch (stageClass){
    case "OK" : return "";
    case null : return "fa fa-refresh fa-spin";
    default : return "fa fa-close";
  }
}




/**** EXTEND ARRAY PROTOTYPE ****/
Array.prototype.inArray = function(element) {
  for(var i=0; i < this.length; i++) {
    if(element === this[i]) return true;
  }
  return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element) {
  if (!this.inArray(element)) {
    this.push(element);
  }
};



















/**** MOCK ****/
var mock = [
  {
    "_id" : "55390a8b05d44a7634b58edd",
    "job" : 561,
    "start_date" : "2015-04-23T15:06:51.707Z",
    "module" : "qa",
    "pusher" : "witokondoria",
    "committers" : [],
    "ref" : "refs/heads/master",
    "result" : "OK",
    "end_date" : "2015-04-23T15:13:23.324Z",
    "stages" : [
      {
        "stage" : "FETCH",
        "start_date" : "2015-04-23T15:06:52.017Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:08:32.535Z"
      },
      {
        "stage" : "BUILD",
        "start_date" : "2015-04-23T15:08:32.892Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:09:44.207Z"
      },
      {
        "stage" : "UT",
        "start_date" : "2015-04-23T15:09:44.620Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:10:14.079Z"
      },
      {
        "stage" : "QC",
        "start_date" : "2015-04-23T15:10:14.440Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:12:40.669Z"
      },
      {
        "stage" : "PACKAGE",
        "start_date" : "2015-04-23T15:12:41.052Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:13:01.541Z"
      },
      {
        "stage" : "DEPLOY",
        "start_date" : "2015-04-23T15:13:01.962Z",
        "result" : "OK",
        "end_date" : "2015-04-23T15:13:22.936Z"
      }
    ]
  },

  {
    "_id" : "5537dee505d44a7634b58ed5",
    "job" : 559,
    "start_date" : "2015-04-22T17:48:21.563Z",
    "module" : "qa",
    "pusher" : "witokondoria",
    "committers" : [],
    "ref" : "refs/heads/master",
    "result" : "KO",
    "end_date" : "2015-04-22T17:49:09.120Z",
    "stages" : [
      {
        "stage" : "FETCH",
        "start_date" : "2015-04-22T17:48:22.813Z",
        "result" : "OK",
        "end_date" : "2015-04-22T17:48:37.033Z"
      },
      {
        "stage" : "BUILD",
        "start_date" : "2015-04-22T17:48:37.441Z",
        "result" : "OK",
        "end_date" : "2015-04-22T17:48:52.725Z"
      },
      {
        "stage" : "UT",
        "start_date" : "2015-04-22T17:48:53.120Z",
        "result" : "KO",
        "end_date" : "2015-04-22T17:49:08.562Z"
      }
    ]
  }
]