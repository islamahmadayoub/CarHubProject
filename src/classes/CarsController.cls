/**
 * Created by islam on 12/27/2023.
 */

public with sharing class CarsController {

    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(
            String searchKeyword,
            Decimal maxPrice,
            List<String> selectedMakes,
            List<String> selectedCategories) {



        System.debug(selectedMakes);
        System.debug(selectedCategories);

        //Constructing the Where Clause for the SOQL Query
        String whereClause = 'WHERE Name LIKE ';

        //Search Keyword
        if (searchKeyword == '' || searchKeyword == null) {
            whereClause = whereClause + '\'%%\'';
        } else if (searchKeyword != null && searchKeyword != '') {
            whereClause = whereClause + '\'%' + searchKeyword + '%\'';
        }

        //Max Price
        if (maxPrice!= null) {
            whereClause = whereClause + ' AND MSRP__c <= ' + maxPrice;
        }

        //Categories
        if (selectedCategories.size() > 0) {
            Integer counter = 0;
            String categoriesWhereClause = '(';
            
            for (String currentCategory: selectedCategories) {

                counter++;
                categoriesWhereClause += '\'' + currentCategory + '\'';

                if (counter != selectedCategories.size()) {
                    categoriesWhereClause += ',';
                } else {
                    categoriesWhereClause += ')';
                }
            }

            whereClause = whereClause + ' AND Category__c IN ' + categoriesWhereClause;
        }

        //Makes
        if (selectedMakes.size() > 0) {
            Integer counter = 0;
            String makesWhereClause = '(';

            for (String currentMake: selectedMakes) {

                counter++;
                makesWhereClause += '\'' + currentMake + '\'';

                if (counter != selectedMakes.size()) {
                    makesWhereClause += ',';
                } else {
                    makesWhereClause += ')';
                }
            }

            whereClause = whereClause + ' AND Make__c IN ' + makesWhereClause;
        }

        // Building the Query
        String query =  'SELECT Id, '            +
                        'Category__c, '          +
                        'Make__c, '              +
                        'MSRP__c, '              +
                        'Description__c, '       +
                        'Name, '                 +
                        'Control__c, '           +
                        'Fuel_Type__c, '         +
                        'Number_of_Seats__c, '   +
                        'Picture_URL__c '        +
                        'FROM Car__c '           +
                        whereClause;
        System.debug(query);

        // SOQL
        List<Car__c> cars = Database.query(query);

        System.debug(cars);

        return cars;
    }

    @AuraEnabled(Cacheable=true)
    public static Car__c getCar(String carId) {
        Car__c car = [SELECT  Id,
                              Name
                      FROM    Car__c
                      WHERE   Id = :carId];
        return car;
    }
}

