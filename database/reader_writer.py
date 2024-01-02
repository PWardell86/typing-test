import psycopg2

USER_TABLE = "TYPING_USER"
SCORE_TABLE = "USER_SCORE"

class Reader:
    def __init__(self):
        self.DB_NAME = "typing"
        self.DB_USER = "postgres"
        self.DB_PASS = "nutballs"
        self.DB_HOST = "localhost"
        self.DB_PORT = "5432"
        self.connection = psycopg2.connect(dbname=self.DB_NAME, user=self.DB_USER, password=self.DB_PASS, host=self.DB_HOST, port=self.DB_PORT)
        self.cursor = self.connection.cursor()
    
    def get_user(self, username):
        self.cursor.execute(f"SELECT * FROM {USER_TABLE} WHERE username = '{username}'")
        return self.cursor.fetchall()
    
    def get_user_password(self, username):
        self.cursor.execute(f"SELECT password FROM {USER_TABLE} WHERE username = '{username}'")
        return self.cursor.fetchall()
    def get_all_users(self):
        self.cursor.execute(f"SELECT * FROM {USER_TABLE}")
        return self.cursor.fetchall()
    
    def get_user_stats(self, username):
        self.cursor.execute(f"SELECT * FROM {USER_TABLE} WHERE id = {username}")
        return self.cursor.fetchall()

class Writer:
    def __init__(self):
        self.DB_NAME = "typing"
        self.DB_USER = "postgres"
        self.DB_PASS = "nutballs"
        self.DB_HOST = "localhost"
        self.DB_PORT = "5432"
        self.connection = psycopg2.connect(dbname=self.DB_NAME, user=self.DB_USER, password=self.DB_PASS, host=self.DB_HOST, port=self.DB_PORT)
        self.cursor = self.connection.cursor()


    def add_user(self, username, display_name, password):
        self.cursor.execute(f"INSERT INTO {USER_TABLE} VALUES ('{username}', '{display_name}', '{password}')")
        self.connection.commit()
        return True

    def remove_user(self, username):
        self.cursor.execute(f"DELETE FROM {USER_TABLE} WHERE username = '{username}'")
        self.connection.commit()
        return True

if __name__ == "__main__":
    w = Writer()
    print(w.add_user("test2", "test2", "pword2"))