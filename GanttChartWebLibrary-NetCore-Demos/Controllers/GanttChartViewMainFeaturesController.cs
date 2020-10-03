using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DlhSoft.Web.Mvc;
using System.Diagnostics;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GanttChartWebLibrary_NetCore_Demos.Controllers
{
    public class GanttChartViewMainFeaturesController : Controller
    {
        private static readonly DateTime date = DateTime.Today;
        private static readonly int year = date.Year, month = date.Month;

        // GET: /<controller>/
        public IActionResult Index()
        {
            var items = new List<GanttChartItem>
            {
                new GanttChartItem { Content = "Task 1" },
                new GanttChartItem { Content = "Task 1.1", Indentation = 1, Start = DateTime.Today, Finish = DateTime.Today.AddDays(3), CompletedFinish = DateTime.Today.AddDays(2), AssignmentsContent = "Resource A" },
                new GanttChartItem { Content = "Task 1.2", Indentation = 1, Start = DateTime.Today.AddDays(3), Finish = DateTime.Today.AddDays(7), AssignmentsContent = "Resource A, Resource B [50%]" },
                new GanttChartItem { Content = "Task 2", Start = DateTime.Today.AddDays(3), Finish = DateTime.Today.AddDays(5), AssignmentsContent = "Resource B" },
                new GanttChartItem { Content = "Task 3", Start = DateTime.Today.AddDays(5), IsMilestone = true }
            };
            items[2].Predecessors.Add(new PredecessorItem { Item = items[1] });
            items[3].Predecessors.Add(new PredecessorItem { Item = items[2], DependencyType = DependencyType.StartStart });
            items[4].Predecessors.Add(new PredecessorItem { Item = items[3] });
            for (var i = 4; i < 16; i++)
                items.Add(new GanttChartItem { Content = $"Task {i}", Start = DateTime.Today.AddDays(i), Finish = DateTime.Today.AddDays(i * 2) });
            items[9].Finish = items[9].Finish + TimeSpan.FromDays(2);
            items[9].AssignmentsContent = "Resource 1";
            items[10].Predecessors = new List<PredecessorItem> { new PredecessorItem { Item = items[9] } };
            items[6].BaselineStart = new DateTime(year, month, 10, 8, 0, 0);
            items[6].BaselineFinish = new DateTime(year, month, 11, 16, 0, 0);
            items[7].BaselineStart = new DateTime(year, month, 8, 8, 0, 0);
            items[7].BaselineFinish = new DateTime(year, month, 11, 16, 0, 0);
            items[8].BaselineStart = new DateTime(year, month, 12, 8, 0, 0);
            return View(model: items);
        }
        
        public ActionResult CreateNewGanttChartItem(int index)
        {
            // Placeholder to prepare new items, e.g. create entities in the data store. Will be followed by an Update call.
            Debug.WriteLine($"New item created at index {index}.");
            return Ok();
        }

        public ActionResult UpdateGanttChartItem(GanttChartItem item)
        {
            // Placeholder to handle changes, e.g. save them to the data store.
            // Note: Characters '<' and '>' are automatically replaced on client side with HTML entities '&lt;' and '&gt;' within text content (e.g. item.Content) to pass security gates upon posting.
            Debug.WriteLine($"Item {item.Content} at index {item.ItemIndex} has been updated.");
            return Ok();
        }

        public ActionResult MoveGanttChartItem(int fromIndex, int toIndex)
        {
            // Placeholder to move items, e.g. move entities in the data store.
            Debug.WriteLine($"Item moved from index {fromIndex} to {toIndex}.");
            return Ok();
        }

        public ActionResult DeleteGanttChartItem(int index)
        {
            // Placeholder to delete items, e.g. remove them from the data store.
            Debug.WriteLine($"Item at index {index} was deleted.");
            return Ok();
        }
    }
}
