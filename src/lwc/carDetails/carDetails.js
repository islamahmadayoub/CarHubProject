/**
 * Created by islam on 12/26/2023.
 */

import {LightningElement, wire} from 'lwc';


// Import Wires
import {getRecord} from "lightning/uiRecordApi";

// Import Fields
import FIELD_NAME from '@salesforce/schema/Car__c.Name';
import FIELD_CATEGORY from '@salesforce/schema/Car__c.Category__c';
import FIELD_MAKE from '@salesforce/schema/Car__c.Make__c';
import FIELD_MSRP from '@salesforce/schema/Car__c.MSRP__c';
import FIELD_DESCRIPTION from '@salesforce/schema/Car__c.Description__c';
import FIELD_CONTROL from '@salesforce/schema/Car__c.Control__c';
import FIELD_FUEL_TYPE from '@salesforce/schema/Car__c.Fuel_Type__c';
import FIELD_NUMBER_OF_SEATS from '@salesforce/schema/Car__c.Number_of_Seats__c';
import FIELD_PICTURE_URL from '@salesforce/schema/Car__c.Picture_URL__c';

const carFields = [FIELD_NAME, FIELD_CATEGORY, FIELD_MAKE, FIELD_MSRP, FIELD_DESCRIPTION, FIELD_CONTROL, FIELD_FUEL_TYPE, FIELD_NUMBER_OF_SEATS, FIELD_PICTURE_URL];

const carRecordId = 'a00Qy000004nnIDIAY';

// Import LMS
import LMS_CARS from '@salesforce/messageChannel/CARS_LMS__c';
import {
    APPLICATION_SCOPE,
    createMessageContext,
    MessageContext,
    publish,
    releaseMessageContext,
    subscribe,
    unsubscribe,
} from 'lightning/messageService';



export default class CarDetails extends LightningElement {
    carId;

    @wire( MessageContext )
    context;

    @wire( getRecord, {
        recordId: '$carId',
        fields  : carFields
    } )
    selectedCar;

    connectedCallback(){
        this.subscribeMessage();
    }

    subscribeMessage(){
        this.subscription = subscribe(this.context, LMS_CARS, (message) => {
            this.handleMessage(message)
        }, {scope: APPLICATION_SCOPE});
    };

    handleMessage(message) {
        this.carId = message.carId;
    }




};