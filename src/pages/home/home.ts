import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import {
    AngularFirestore,
    AngularFirestoreCollection
  } from 'angularfire2/firestore';  
import { Observable } from 'rxjs/Observable';

  export interface Todo {
    id?: string;
    description: string;
    completed: boolean;
  }
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  todoCollectionRef: AngularFirestoreCollection<Todo>;
  todo$: Observable<Todo[]>;

  constructor(public navCtrl: NavController, private db: AngularFirestore, public alertCtrl: AlertController) {
    this.todoCollectionRef = this.db.collection<Todo>('items');
    this.todo$ = this.todoCollectionRef.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Todo;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  addCar(){
    let prompt = this.alertCtrl.create({
      title: 'Add Item',
      inputs: [{
          name: 'text'
      }],
      buttons: [
          {
              text: 'Cancel'
          },
          {
              text: 'Add',
              handler: data => {
                this.addItem(data.text);
              }
          }
      ]
  });

  prompt.present();
  }

  editCar(key: string, oldString: string, oldCompleted: boolean){
    
           let prompt = this.alertCtrl.create({
               title: 'Editar',
               inputs: [{
                   name: 'text',
                   value: oldString
               }],
               buttons: [
                   {
                       text: 'Cancel'
                   },
                   {
                       text: 'Save',
                       handler: data => {
                           this.updateItem(
                                key,
                                data.text,
                                oldCompleted
                                );
                       }
                   }
               ]
           });
    
           prompt.present();       
    
       }

  addItem(newName: string) {
    if (newName && newName.trim().length) {
        this.todoCollectionRef.add({ description: newName, completed: false });
      }
  }

  updateItem(todoid: string, tododesc: string, todocomp: boolean) {
    this.todoCollectionRef.doc(todoid).update({ description: tododesc, completed: todocomp });
  }

  deleteItem(todoid: string) {
    this.todoCollectionRef.doc(todoid).delete();
  }
  
}
