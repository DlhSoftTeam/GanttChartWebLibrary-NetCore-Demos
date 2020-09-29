var controllerPath, ganttChartView;

function initializeGanttChart(controller, view, theme) {
    controllerPath = controller;
    ganttChartView = view;
    var settings = ganttChartView.settings;
    initializeGanttChartTheme(settings, theme);
    initializeGanttChartTemplates(settings, theme);
}

function addNewGanttChartItem() {
    var item = { content: 'New task' };
    ganttChartView.addItem(item);
    ganttChartView.selectItem(item);
    ganttChartView.scrollToItem(item);
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