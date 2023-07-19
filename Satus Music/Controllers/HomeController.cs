using Microsoft.AspNetCore.Mvc;

namespace Satus_Music.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
            
        }

        public ActionResult Home()
        {
            return View();
        }

    }
}
