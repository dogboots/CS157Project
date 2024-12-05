1. Have MySQL installed then Install npm:

https://nodejs.org/

Download and install Node.js using the Windows Installer (.msi file):

LTS (Long Term Support) version is recommended for most users.
Node.js installation includes npm.

Verify the installation by checking the versions of Node.js and npm:
node -v
npm -v

2. Download the files from GitHub

3. Navigate to the directory where CS157Project/project is stored in cmd prompt and do the following commands:

npm install (installs dependencies)
npm run dev (runs development server and follow directions on terminal for opening locahost in browswer)

4. Create a .env.local file in the project folder to connect to database:
DB_HOST=(usually localhost)
DB_USER=(usually root)
DB_PASSWORD=(db password)
DB_NAME=(name of db)

5. Then run your MySQL server and paste in the ecommercedb.sql file script.


Division of work:

Leo- Designed the database and made the ER model work well. Created the database file, checked the work for accuracy, and helped with the report and slides by adding technical details.

Mehek- Created the ER data model and checked the database design for any issues. Also started the report and contributed to the slides.

Miggy- Divided work and made sure progression was on pace. Reviewed the database design, set up the back-end and API infrastructure, and contributed as a full-stack developer. Also collaborated on the report and presentation slides.

Richard- Contributed to the development of the ER data model and provided a careful review of the database design. Was actively involved in the report and started the presentation slides.

Vincent- Initiated the repository and established the foundation for the front-end. Worked as a full-stack contributor for components of both the client and server sides. Additionally, contributed significantly to the project documentation, assisting with the report and the presentation slides.

