using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SuperArtikli.Models
{
    public class Article
    {
        public int ID { get; set; }
        public string naziv { get; set; }
        public string kategorija{ get; set; }
        public decimal cijena{ get; set; }
    }
}