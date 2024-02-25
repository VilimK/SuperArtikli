using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace SuperArtikli.Models
{
    public class ArticleDatabase
    {
        private string connectionString;

        public ArticleDatabase()
        {
            connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        }

        public int DeleteArticleWithID(int id)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM artikli WHERE ID = @id"; 
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id); 
                connection.Open();
                int numberOfRowsDeleted= command.ExecuteNonQuery();
                return numberOfRowsDeleted; 
            }
        }

        public bool InsertArticle(int id, string name, string category, double price)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query =
                    "INSERT INTO artikli (ID, naziv, kategorija, cijena)" +
                    "VALUES (@id, @name, @category, @price);";
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", name);
                command.Parameters.AddWithValue("@category", category);
                command.Parameters.AddWithValue("@price", price);
                connection.Open();
                int numberOfRowsInserted = command.ExecuteNonQuery();
                return numberOfRowsInserted > 0;
            }
        }

        public bool ChangeArticleWithId(int id, string name, string category, double price)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                //Pripremimo query ovisno koje podatke korisnik mijenja
                var query = CreateProperChangeQuery(name, category, price); 
                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", name);
                command.Parameters.AddWithValue("@category", category);
                command.Parameters.AddWithValue("@price", price);
                connection.Open();
                command.ExecuteNonQuery();
                return true;
            }
        }
        public List<int> GetAllArticleIDs()
        {
            List<int> ids = new List<int>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT ID FROM artikli";
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                
                while (reader.Read())
                {
                    int id = (int)reader["ID"];
                    ids.Add(id);
                }
                reader.Close();
                
            }
            return ids;
        }

        public List<Article> GetAllDataFromArticlesTable()
        {
            List<Article> articles = new List<Article>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM artikli";
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    Article article = new Article
                    {
                        ID = (int)reader["ID"],
                        naziv = reader["naziv"].ToString(),
                        kategorija = reader["kategorija"].ToString(),
                        cijena = (decimal)reader["cijena"]
                    };
                    articles.Add(article);
                }
                reader.Close();
            }
            return articles;
        }

        public string CreateProperChangeQuery(string name,string category, double price)
        {
            if (name == "" && category == "" && price != -1) return "UPDATE artikli SET cijena = @price WHERE ID = @id;";
            else if (name == "" && category != "" && price != -1) return "UPDATE artikli SET kategorija = @category, cijena = @price WHERE ID = @id;";        
            else if (name != "" && category != "" && price != -1) return "UPDATE artikli SET naziv = @name, kategorija= @category, cijena = @price WHERE ID = @id;";
            else if (name != "" && category != "" && price == -1) return "UPDATE artikli SET naziv = @name, kategorija = @cateogry WHERE ID = @id;";
            else if (name != "" && category == "" && price != -1) return "UPDATE artikli SET naziv = @name, cijena = @price WHERE ID = @id;";
            else if (name != "" && category == "" && price == -1) return "UPDATE artikli SET naziv = @name WHERE ID = @id;"; 
            else return "UPDATE artikli SET kategorija = @category WHERE ID = @id;";
        }
    }
}