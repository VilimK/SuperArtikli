# Upute za pokretanje
Nakon skidanja svih fileova, u Visual Studiu buildati solution i pokrenuti ga. 
Dodatni SQL upiti ne trebaju jer je baza na Azureu. Sve IP-adrese imaju pravo pristupa, ako je kojim slučajem nešto blokirani slobodno javite.  

## Baza podataka 
- artikli
  - ID (PK, int, not null)
  - naziv (nvarchar, null)
  - kategorija (nvarchar, null)
  - cijena (decimal, null)
- users
  - ID (PK, int, not null)
  - naziv (nvarchar, not null)
  - hashed_password (nvarchar, not null)
  - IsAdmin (bit, not null)
 
Tablica users nije se ne koristi jer nisam stigao implementirati login. 

### SQL upiti koji se koriste
  - "DELETE FROM artikli WHERE ID = @id;"
  - "INSERT INTO artikli (ID, naziv, kategorija, cijena) VALUES (@id, @name, @category, @price);"
  - "UPDATE artikli SET cijena = @price WHERE ID = @id;"
  - "UPDATE artikli SET kategorija = @category, cijena = @price WHERE ID = @id;"
  - "UPDATE artikli SET naziv = @name, kategorija= @category, cijena = @price WHERE ID = @id;"
  - "UPDATE artikli SET naziv = @name, kategorija = @cateogry WHERE ID = @id;"
  - "UPDATE artikli SET naziv = @name, cijena = @price WHERE ID = @id;"
  - "UPDATE artikli SET naziv = @name WHERE ID = @id;"
  - "UPDATE artikli SET kategorija = @category WHERE ID = @id;"
  - "SELECT * FROM artikli;"
  - "SELECT ID FROM artikli"
Očito je što pojedini upit radi na bazi podataka. Ovi upiti su direktno korišteni u aplikaciji u klasi ArticleDatabase.cs.

#### Raspored koda
Frontend (javascript, html, css) je smješten u sljedeće fileove:
  - home.html
  - homeUtils.js
  - ajaxRequests.js
  - modal.css
  - home.css
i tako dalje...

Backend je cjelovito napravljen u MVC arhitekturi. Klase poput Article.cs u folderu Models te kontroleri u Controllers.
