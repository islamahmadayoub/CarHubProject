/**
 * Created by islam on 12/26/2023.
 */

import {LightningElement, wire} from 'lwc';

// Import LMS
import CARS_LMS from '@salesforce/messageChannel/CARS_LMS__c';
import {
    APPLICATION_SCOPE,
    MessageContext,
    publish,
    subscribe
} from 'lightning/messageService';

// Import APEX Methods
import  apexMethod_getCars from '@salesforce/apex/CarsController.getCars';


export default class CarTiles extends LightningElement {

    subscription;
    searchKeyword      = '';
    maxPrice           = 500000;
    selectedCategories = [];
    selectedMakes      = [];
    carId              = '';


    @wire( apexMethod_getCars,
        {
            searchKeyword     : '$searchKeyword'      ,
            maxPrice          : '$maxPrice'           ,
            selectedCategories: '$selectedCategories' ,
            selectedMakes     : '$selectedMakes'

        } )
    cars;



    // Get LMS Message Context
    @wire(MessageContext)
    context;

    connectedCallback() {
        this.subscribeToLMS();
    }

    subscribeToLMS(){
        this.subscription =
            subscribe(  this.context,
                        CARS_LMS,
                        (message) => { this.handleMessage(message)},
                        {scope: APPLICATION_SCOPE});
    };

    handleMessage(message) {

        this.searchKeyword      = message.SearchKeyword;
        this.maxPrice           = message.MaxPrice;
        this.selectedCategories = message.SelectedCategories;
        this.selectedMakes      = message.SelectedMakes;


        console.log( `Received component information`           ) ;
        console.log( `Search Keyword is: ${this.searchKeyword}` ) ;
        console.log( `Max Price is     : ${  this.maxPrice   }` ) ;
        console.log( 'Selected Categories are: '                ) ;
        console.log( JSON.stringify( this.selectedCategories )  ) ;
        console.log( 'Selected Makes are: '                     ) ;
        console.log( JSON.stringify(   this.selectedMakes    )  ) ;

    }

    onCarSelect(event) {
        this.carId = event.currentTarget.dataset.id;

        const message = {
            carId: this.carId
        }

        publish( this.context, CARS_LMS, message );

        console.log( `Car Tiles is Sending this Info` );
        console.log( this.carId );
        console.log( event.currentTarget.dataset );
        console.dir( event.currentTarget );
        console.log( JSON.stringify( event.currentTarget ) );

    }



};