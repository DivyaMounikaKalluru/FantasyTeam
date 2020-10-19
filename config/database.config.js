module.exports = {
    /*url: 'Driver={ODBC Driver 13 for SQL Server};Server=tcp:fantasyfootball-server.database.windows.net,1433;Database=fantasyfootball-db-server;Uid=ff_admin;Pwd={your_password_here};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;',*/
	 user: 'ff_admin',
     password: 'cincy@2020',
     server: 'fantasyfootball-server.database.windows.net', 
     database: 'fantasyfootball-db-server' ,
      options: {
    enableArithAbort: true,
    encrypt: true
		}
}