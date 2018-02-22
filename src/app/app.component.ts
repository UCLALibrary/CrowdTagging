import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'

export interface Todo { name: string; }
export interface Book { title: string; author: string; genre: string; pages: number; publisher: string;}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todoCollec: AngularFirestoreCollection<Todo>;
  todos: Observable<Todo[]>;
  todo: Observable<Todo>;

  bookCollection: AngularFirestoreCollection<Book>;
  books: Observable<Book[]>;

  constructor(private afs: AngularFirestore){
      this.todoCollec = afs.collection<Todo>('todos');
      this.todos = this.todoCollec.valueChanges();
      this.todo = this.afs.doc<Todo>('todos/1').valueChanges();
      
      this.bookCollection = afs.collection<Book>('books');
      this.books = this.bookCollection.valueChanges();
  }
  
  title = 'CrowdTagging';
  
  ngOnInit(){
  }

  addTodo(name: string){
      const todo: Todo = { name };
      this.todoCollec.add(todo);
  }
  

}
