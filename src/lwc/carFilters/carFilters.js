/**
 * Created by islam on 12/26/2023.
 */

import {LightningElement, wire} from 'lwc';

// Import LMS
import CARS_LMS from '@salesforce/messageChannel/CARS_LMS__c';
import {
	APPLICATION_SCOPE,
	createMessageContext,
	MessageContext,
	publish,
	releaseMessageContext,
	subscribe,
	unsubscribe,
} from 'lightning/messageService';

// Import Objects
import OBJECT_CAR from '@salesforce/schema/Car__c';

// Import Fields
import FIELD_CATEGORY from '@salesforce/schema/Car__c.Category__c';
import FIELD_MAKE from '@salesforce/schema/Car__c.Make__c';

// Import Wire Adapters
import {getObjectInfo, getPicklistValues} from "lightning/uiObjectInfoApi";


export default class CarFilters extends LightningElement {

	// Properties
	searchKeyword           = '';
	maxPrice                = 500000;
	selectedCategories      = [];
	selectedMakes           = [];
	displayedCategories;
	displayedMakes;



	// Wire Car Object Info
	@wire( getObjectInfo, {objectApiName: OBJECT_CAR} )
	carObjectInfo;

	// Wire Categories
	@wire( getPicklistValues, {
		recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
		fieldApiName: FIELD_CATEGORY
	} ) categoriesHandler( {data, error} ) {
		if ( data ) {
			this.displayedCategories = data;
			this.displayedCategories.values.forEach( ( displayedCategory ) => {
				this.selectedCategories = this.selectedCategories.concat( displayedCategory.value );

			} );


		}
		if ( error ) {
			console.error( error );
		}
	}

	// Wire Makes
	@wire( getPicklistValues, {
		fieldApiName: FIELD_MAKE,
		recordTypeId: '$carObjectInfo.data.defaultRecordTypeId'
	} ) makesHandler( {data, error} ) {
		if ( data ) {
			this.displayedMakes = data;
			this.displayedMakes.values.forEach( ( displayedMake ) => {
				this.selectedMakes = this.selectedMakes.concat( displayedMake.value );
			} );
		}
		if ( error ) {
			console.error( error );
		}
	};

	// Get LMS Message Context
	@wire( MessageContext )
	context;

	// Filters Methods
	onSearch( event ) {
		this.searchKeyword = event.target.value;
		this.publishMessage();
	}

	onSlide( event ) {
		this.maxPrice = event.target.value;
		this.publishMessage();

	}

	onCategoryChange( event ) {
		const selectedCategoryValue = event.target.dataset.id;

		if ( event.target.checked ) {
			this.selectedCategories = [...this.selectedCategories, selectedCategoryValue];
		} else {
			const index = this.selectedCategories.indexOf( selectedCategoryValue );
			this.selectedCategories.splice( index, 1 );
		}

		this.publishMessage();
	}

	onMakeChange( event ) {
		const selectedMakeValue = event.target.dataset.id;

		if ( event.target.checked ) {
			this.selectedMakes = [...this.selectedMakes, selectedMakeValue];
		} else {
			const index = this.selectedMakes.indexOf( selectedMakeValue );
			this.selectedMakes.splice( index, 1 );
		}

		this.publishMessage();
	}

	// Publish Message
	publishMessage() {

		const message = {
			MaxPrice            : this.maxPrice,
			SearchKeyword       : this.searchKeyword,
			SelectedCategories  : this.selectedCategories,
			SelectedMakes       : this.selectedMakes
		}

		publish( this.context, CARS_LMS, message );
	}
}


