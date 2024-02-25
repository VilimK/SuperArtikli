using SuperArtikli.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SuperArtikli.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ArticleDatabase database = new ArticleDatabase();
            List<Article> articles = database.GetAllDataFromArticlesTable();
            string articlesJson = Newtonsoft.Json.JsonConvert.SerializeObject(articles);
            string htmlContent = System.IO.File.ReadAllText(Server.MapPath("~/Views/Content/home.html"));
            htmlContent = htmlContent.Replace("{{ArticlesData}}", articlesJson);
            return Content(htmlContent, "text/html");
        }

        [HttpPost]
        public ActionResult DeleteArticle(int id)
        {
            try
            {
                ArticleDatabase database = new ArticleDatabase();
                database.DeleteArticleWithID(id); 
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }
        [HttpPost]
        public ActionResult ChangeArticle(string id, string name, string category, string price)
        {
            
            int ids = Int32.Parse(id);
            if (price == "") price = "-1"; 
            else price = price.Replace(",", ".");
            double price_num = Convert.ToDouble(price);
            try
            {
                ArticleDatabase database = new ArticleDatabase();
                bool IsRowChanged = database.ChangeArticleWithId(ids, name, category, price_num);
                if (IsRowChanged) return Json(new { success = true });
                else return Json(new { succes = false });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        public ActionResult AddArticle(string name, string category,string price)
        {
            price = price.Replace(",", ".");
            double price_num = Convert.ToDouble(price); 

            try
            {
                ArticleDatabase database = new ArticleDatabase();
                List<int> ids = database.GetAllArticleIDs();
                int id = FindNewID(ids); 
                bool IsRowInserted = database.InsertArticle(id,name,category,price_num);
                if (IsRowInserted) return Json(new { success = true });
                else return Json(new { succes = false });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        public int FindNewID(List<int> ids) {
            int i = 1;
            ids.Sort();
            for (i = 1; i <= ids.Count; i++)
            {
                if(i != ids[i-1]) return i;
            }
            return i; 
        }
        public bool IsPriceValid(double num)
        {
            if (Math.Abs(num % 1) < 0.0001 || Math.Abs(num % 0.01) < 0.0001 || Math.Abs(num % 0.1) < 0.0001)
            {
                if (num > 0) return true;
            }

            return false;
        }
    }
}