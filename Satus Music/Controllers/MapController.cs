using Microsoft.AspNetCore.Mvc;

namespace Satus_Music.Controllers
{
    public class MapController : Controller
    {
        public MapController()
        {

        }

        public ActionResult Map()
        {
            return View();
        }
    }
}
