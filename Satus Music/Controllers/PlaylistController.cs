using Microsoft.AspNetCore.Mvc;

namespace Satus_Music.Controllers
{
    public class PlaylistController : Controller
    {
        public PlaylistController()
        {

        }
        public ActionResult PlaylistEditor()
        {
            return View();
        }
    }
}
