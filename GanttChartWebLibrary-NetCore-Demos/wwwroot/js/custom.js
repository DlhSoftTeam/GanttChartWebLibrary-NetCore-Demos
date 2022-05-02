var controllerPath, ganttChartView, theme;

function initializeGanttChart(controllerPathValue, viewReference, themeValue) {
    controllerPath = controllerPathValue;
    ganttChartView = viewReference;
    theme = themeValue;
    var settings = ganttChartView.settings;
    initializeGanttChartTheme(settings, theme);
}

function addNewGanttChartItem() {
    var item = { content: 'New task' };
    ganttChartView.addItem(item);
    ganttChartView.selectItem(item);
    ganttChartView.scrollToItem(item);
    ganttChartView.scrollToDateTime(item.start);
    fetch(controllerPath + '/CreateNewGanttChartItem?index=' + item.index);
}
function insertNewGanttChartItem() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    var item = { content: 'New task' };
    ganttChartView.insertItem(selectedItem.index, item);
    ganttChartView.selectItem(item);
    ganttChartView.scrollToItem(item);
    ganttChartView.scrollToDateTime(item.start);
    fetch(controllerPath + '/CreateNewGanttChartItem?index=' + item.index);
}
function deleteGanttChartItem() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    if (!confirm("Are you sure you want to delete the selected task?"))
        return;
    fetch(controllerPath + '/DeleteGanttChartItem?index=' + selectedItem.index);
    ganttChartView.removeItem(selectedItem);
}
function increaseGanttChartItemIndentation() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    ganttChartView.increaseItemIndentation(selectedItem);
}
function decreaseGanttChartItemIndentation() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    ganttChartView.decreaseItemIndentation(selectedItem);
}

function setCustomBarColorToItem() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    selectedItem.barStyle = !selectedItem.barStyle ? 'stroke: Green; fill: LightGreen' : undefined;
    selectedItem.completedBarStyle = !selectedItem.completedBarStyle ? 'stroke: DarkGreen; fill: DarkGreen' : undefined;
    ganttChartView.refreshChartItem(selectedItem);
}

var copiedItem;
function copyItem() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    copiedItem = { content: selectedItem.content, start: selectedItem.start, finish: selectedItem.finish, completedFinish: selectedItem.completedFinish, isMilestone: selectedItem.isMilestone, assignmentsContent: selectedItem.assignmentsContent, isRelativeToTimezone: selectedItem.isRelativeToTimezone, baselineStart: selectedItem.baselineStart, baselineFinish: selectedItem.baselineFinish, executionCost: selectedItem.executionCost, barStyle: selectedItem.barStyle, completedBarStyle: selectedItem.completedBarStyle };
}
function pasteItem() {
    if (!copiedItem)
        return;
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    var item = { content: copiedItem.content, start: copiedItem.start, finish: copiedItem.finish, completedFinish: copiedItem.completedFinish, isMilestone: copiedItem.isMilestone, assignmentsContent: copiedItem.assignmentsContent, isRelativeToTimezone: copiedItem.isRelativeToTimezone, baselineStart: copiedItem.baselineStart, baselineFinish: copiedItem.baselineFinish, executionCost: copiedItem.executionCost, barStyle: copiedItem.barStyle, completedBarStyle: copiedItem.completedBarStyle };
    ganttChartView.insertItem(selectedItem.index + 1, item);
    ganttChartView.selectItem(item);
    ganttChartView.scrollToItem(item);
    ganttChartView.scrollToDateTime(item.start);
    fetch(controllerPath + '/CreateNewGanttChartItem?index=' + item.index);
}

function moveItemUp() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    var originalIndex = selectedItem.index;
    ganttChartView.moveItemHierarchyUp(selectedItem);
    ganttChartView.scrollToItem(selectedItem);
    fetch(controllerPath + '/MoveGanttChartItem?fromIndex=' + originalIndex + '&toIndex=' + selectedItem.index);
}
function moveItemDown() {
    var selectedItem = ganttChartView.selectedItem;
    if (!selectedItem)
        return;
    var originalIndex = selectedItem.index;
    ganttChartView.moveItemHierarchyDown(selectedItem);
    ganttChartView.scrollToItem(selectedItem);
    fetch(controllerPath + '/MoveGanttChartItem?fromIndex=' + originalIndex + '&toIndex=' + selectedItem.index);
}

var date = new Date(), year = date.getFullYear(), month = date.getMonth();
function setCustomScales() {
    var settings = ganttChartView.settings;
    settings.headerHeight = 21 * 3;
    settings.scales = [{ scaleType: 'NonworkingTime', isHeaderVisible: false, isHighlightingVisible: true, highlightingStyle: 'stroke-width: 0; fill: #f8f8f8; fill-opacity: 0.65' },
    { scaleType: 'Months', headerTextFormat: 'Month', headerStyle: 'padding: 2.25px; border-right: solid 1px White; border-bottom: solid 1px White; color: gray', isSeparatorVisible: true, separatorStyle: 'stroke: #c8bfe7; stroke-width: 0.5px' },
    { scaleType: 'Weeks', headerTextFormat: 'Date', headerStyle: 'padding: 2.25px; border-right: solid 1px White; border-bottom: solid 1px White; color: gray', isSeparatorVisible: true, separatorStyle: 'stroke: #c8bfe7; stroke-width: 0.5px' },
    { scaleType: 'Days', headerTextFormat: 'Day', headerStyle: 'padding: 2.25px; border-right: solid 1px White; color: gray' },
    { scaleType: 'CurrentTime', isHeaderVisible: false, isSeparatorVisible: true, separatorStyle: 'stroke: #e31d3b; stroke-width: 0.5px' }];
    settings.updateScale = 60 * 60 * 1000; // 1 hour
    settings.hourWidth = 5;
    settings.visibleWeekStart = 1; // Monday
    settings.visibleWeekFinish = 5; // Friday
    settings.workingWeekStart = 1; // Monday
    settings.workingWeekFinish = 4; // Thursday
    settings.visibleDayStart = 10 * 60 * 60 * 1000; // 10 AM
    settings.visibleDayFinish = 20 * 60 * 60 * 1000; // 8 PM
    settings.specialNonworkingDays = [new Date(year, month, 24), new Date(year, month, 25)];
    ganttChartView.refresh();
}
function zoomIn() {
    ganttChartView.setHourWidth(ganttChartView.settings.hourWidth * 2);
}
function increaseTimelinePage() {
    ganttChartView.increaseTimelinePage(4 * 7 * 24 * 60 * 60 * 1000); // 4 weeks
}
function decreaseTimelinePage() {
    ganttChartView.decreaseTimelinePage(4 * 7 * 24 * 60 * 60 * 1000); // 4 weeks
}

function toggleBaseline() {
    var settings = ganttChartView.settings;
    settings.isBaselineVisible = !settings.isBaselineVisible;
    toggleBaselineCommand.className = settings.isBaselineVisible ? 'ribbonCommand toggle pressed' : 'ribbonCommand toggle';
    ganttChartView.refresh();
}
function highlightCriticalPath() {
    highlightCriticalPathCommand.className = 'ribbonCommand toggle pressed';
    for (var i = 0; i < ganttChartView.items.length; i++) {
        var item = ganttChartView.items[i];
        delete item.barStyle;
        if (!item.hasChildren && ganttChartView.isItemCritical(item))
            item.barStyle = 'stroke: #e31d3b; fill: #e31d3b';
        ganttChartView.refreshChartItem(item);
    }
}
function toggleDependencyConstraints() {
    var settings = ganttChartView.settings;
    settings.areTaskDependencyConstraintsEnabled = !settings.areTaskDependencyConstraintsEnabled;
    toggleDependencyConstraintsCommand.className = settings.areTaskDependencyConstraintsEnabled ? 'ribbonCommand toggle pressed' : 'ribbonCommand toggle';
    ganttChartView.refresh();
}
function levelResources() {
    // Level the assigned resources for all tasks, including the already started ones, considering the current time displayed in the chart.
    ganttChartView.levelResources(true, ganttChartView.settings.currentTime);
    // Alternatively, optimize work to obtain the minimum project finish date and time assuming unlimited resource availability:
    // ganttChartView.optimizeWork(false, true, ganttChartView.settings.currentTime);
}

function scheduleChart() {
    var scheduleChartPanel = document.querySelector('#scheduleChartPanel');
    scheduleChartPanel.style.display = 'inherit';
    var scheduleChartItems = ganttChartView.getScheduleChartItems();
    var scheduleChartSettings = { isReadOnly: true, selectionMode: 'None' };
    var scheduleChartView = document.querySelector('#scheduleChartView');
    initializeGanttChartTheme(scheduleChartSettings, theme);
    initializeGanttChartTemplates(scheduleChartSettings, theme);
    DlhSoft.Controls.ScheduleChartView.initialize(scheduleChartView, scheduleChartItems, scheduleChartSettings);
}
function closeScheduleChartView() {
    var scheduleChartPanel = document.querySelector('#scheduleChartPanel');
    scheduleChartPanel.style.display = 'none';
}
function loadChart() {
    var loadChartPanel = document.querySelector('#loadChartPanel');
    loadChartPanel.style.display = 'inherit';
    var loadChartItems = ganttChartView.getLoadChartItems();
    var loadChartSettings = { selectionMode: 'None' };
    var loadChartView = document.querySelector('#loadChartView');
    initializeLoadChartTheme(loadChartSettings, theme);
    DlhSoft.Controls.LoadChartView.initialize(loadChartView, loadChartItems, loadChartSettings);
    initializeLoadChartResourceSelector();
}
function initializeLoadChartResourceSelector() {
    var loadChartResourceFilter = document.querySelector('#loadChartResourceFilter'), i;
    for (i = loadChartResourceFilter.childNodes.length; i-- > 2;)
        loadChartResourceFilter.removeChild(loadChartResourceFilter.childNodes[i]);
    var resources = ganttChartView.getAssignedResources();
    for (i = 0; i < resources.length; i++) {
        var resource = resources[i];
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(resource));
        loadChartResourceFilter.appendChild(option);
    }
    loadChartResourceFilterChanged();
}
function loadChartResourceFilterChanged() {
    if (loadChartPanel.style.display != 'none') {
        var loadChartView = document.querySelector('#loadChartView');
        var loadChartResourceFilter = document.querySelector('#loadChartResourceFilter');
        var resourceFilterValue = loadChartResourceFilter.value;
        if (resourceFilterValue == '') {
            loadChartView.loadChartItems = ganttChartView.getLoadChartItems();
            loadChartView.settings.itemHeight = 28;
            loadChartView.settings.barHeight = 20;
        }
        else {
            loadChartView.loadChartItems = ganttChartView.getLoadChartItems([resourceFilterValue]);
            loadChartView.settings.itemHeight = 112;
            loadChartView.settings.barHeight = 104;
        }
        loadChartView.refresh();
    }
}
function closeLoadChartView() {
    var loadChartPanel = document.querySelector('#loadChartPanel');
    loadChartPanel.style.display = 'none';
}
function pertChart() {
    var pertChartPanel = document.querySelector('#pertChartPanel');
    pertChartPanel.style.display = 'inherit';
    // Optionally, pass 0 as method parameter to generate a lighter diagram for root tasks only.
    var pertChartItems = ganttChartView.getPertChartItems();
    var pertChartSettings = { chartMargin: 2, snapRearrangedItemsToGuidelines: false };
    var pertChartView = document.querySelector('#pertChartView');
    initializePertChartTheme(pertChartSettings, theme);
    initializePertChartTemplates(pertChartSettings, theme);
    DlhSoft.Controls.Pert.PertChartView.initialize(pertChartView, pertChartItems, pertChartSettings);
    var criticalItems = pertChartView.getCriticalItems();
    for (var i = 0; i < criticalItems.length; i++) {
        var item = criticalItems[i];
        item.shapeStyle = 'stroke: #e31d3b; fill: White';
        pertChartView.refreshItem(item);
    }
    // Optionally, reposition end nodes in order to get better visualization.
    // pertChartView.repositionEnds();
}
function closePertChartView() {
    var pertChartPanel = document.querySelector('#pertChartPanel');
    pertChartPanel.style.display = 'none';
}
function networkDiagram() {
    var networkDiagramPanel = document.querySelector('#networkDiagramPanel');
    networkDiagramPanel.style.display = 'inherit';
    // Optionally, pass 0 as method parameter to generate a lighter diagram for root tasks only.
    var networkDiagramItems = ganttChartView.getNetworkDiagramItems();
    var networkDiagramSettings = { diagramMargin: 2, snapRearrangedItemsToGuidelines: false };
    var networkDiagramView = document.querySelector('#networkDiagramView');
    initializePertChartTheme(networkDiagramSettings, theme);
    initializePertChartTemplates(networkDiagramSettings, theme);
    DlhSoft.Controls.Pert.NetworkDiagramView.initialize(networkDiagramView, networkDiagramItems, networkDiagramSettings);
    var criticalItems = networkDiagramView.getCriticalItems();
    for (var i = 0; i < criticalItems.length; i++) {
        var item = criticalItems[i];
        item.shapeStyle = 'stroke: #e31d3b; fill: White';
        networkDiagramView.refreshItem(item);
    }
    // Optionally, reposition end nodes in order to get better visualization.
    // networkDiagramView.repositionEnds();
}
function closeNetworkDiagramView() {
    var networkDiagramPanel = document.querySelector('#networkDiagramPanel');
    networkDiagramPanel.style.display = 'none';
}
function projectStatistics() {
    var startOutput = ganttChartView.getOutputDate(ganttChartView.getProjectStart()).toDateString();
    var finishOutput = ganttChartView.getOutputDate(ganttChartView.getProjectFinish()).toDateString();
    var hourDuration = 60 * 60 * 1000;
    var rounding = 100;
    var effortOutput = Math.round(ganttChartView.getProjectTotalEffort() / hourDuration * rounding) / rounding;
    var completionOutput = Math.round(ganttChartView.getProjectCompletion() * 100 * rounding) / rounding;
    var costOutput = Math.round(ganttChartView.getProjectCost() * rounding) / rounding;
    alert('Project statistics:\nStart: ' + startOutput + '\nFinish: ' + finishOutput + '\nEffort: ' + effortOutput + 'h\nCompl.: ' + completionOutput + '%\nCost: $' + costOutput);
}

function saveProjectXml() {
    var saveProjectXmlPanel = document.querySelector('#saveProjectXmlPanel');
    saveProjectXmlPanel.style.display = 'inherit';
    var projectXmlSerializerSettings = { compact: true, spaceSeparated: true };
    var projectSerializer = DlhSoft.Controls.GanttChartView.ProjectSerializer.initialize(ganttChartView, projectXmlSerializerSettings);
    var saveProjectXmlOutput = document.querySelector('#saveProjectXmlOutput');
    saveProjectXmlOutput.value = projectSerializer.getXml();
    saveProjectXmlOutput.focus();
    saveProjectXmlOutput.select();
}
function closeSaveProjectXml() {
    var saveProjectXmlPanel = document.querySelector('#saveProjectXmlPanel');
    saveProjectXmlPanel.style.display = 'none';
}
function print() {
    // Print the task hierarchy column and a selected timeline page of 5 weeks (timeline end week extensions would be added automatically, if necessary).
    // Optionally, to rotate the print output and simulate Landscape printing mode (when the end user keeps Portrait selection in the Print dialog), append the rotate parameter set to true to the method call: rotate: true.
    ganttChartView.print({ title: 'Gantt Chart (printable)', isGridVisible: true, columnIndexes: [1], timelineStart: new Date(year, month, 1), timelineFinish: new Date(new Date(year, month, 1).valueOf() + 5 * 7 * 24 * 60 * 60 * 1000), preparingMessage: '...' });
}