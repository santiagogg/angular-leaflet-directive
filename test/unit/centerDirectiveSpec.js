'use strict';

/*jshint -W117 */
/*jshint globalstrict: true*/
/* jasmine specs for directives go here */

describe('Directive: leaflet center', function() {
    var $compile, $rootScope, $timeout, $location, leafletData, center, scope;

    beforeEach(module('leaflet-directive'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$location_, _leafletData_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        $location = _$location_;
        leafletData = _leafletData_;
    }));

    afterEach(inject(function($rootScope) {
        $rootScope.$apply();
    }));

    beforeEach(function(){
        center = {
            lat: 0.966,
            lng: 2.02,
            zoom: 4
        };

        scope = $rootScope.$new();
        scope.center = center;
    });

    it('should have default {[0, 0], 1} parameters on the map if not correctly defined', function() {
        scope.center = {};
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();

        leafletData.getMap().then(function(map) {
            expect(map.getZoom()).toEqual(1);
            expect(map.getCenter().lat).toEqual(0);
            expect(map.getCenter().lng).toEqual(0);
        });
    });

    it('should update the map center if the initial center scope properties are set', function() {
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        scope.$digest();

        leafletData.getMap().then(function(map) {
            expect(map.getZoom()).toEqual(center.zoom);
            expect(map.getCenter().lat).toBeCloseTo(0.966);
            expect(map.getCenter().lng).toBeCloseTo(2.02);
        });
    });

    it('should update the map center if the scope center properties changes', function() {
        var element = angular.element('<leaflet center="center"></leaflet>');
        element = $compile(element)(scope);
        var map;
        leafletData.getMap().then(function(leafletMap) {
            map = leafletMap;
        });
        scope.$apply();

        expect(map.getCenter().lat).toBeCloseTo(0.966);
        expect(map.getCenter().lng).toBeCloseTo(2.02);
        expect(map.getZoom()).toEqual(4);

        center.lat = 2.02;
        center.lng = 4.04;
        center.zoom = 8;
        $rootScope.$digest();

        expect(map.getCenter().lat).toBeCloseTo(2.02);
        expect(map.getCenter().lng).toBeCloseTo(4.04);
        expect(map.getZoom()).toEqual(8);
    });

    describe('Using url-hash functionality', function() {
        it('should update the center of the map if changes the url', function() {
            var element = angular.element('<leaflet center="center" url-hash-center="yes"></leaflet>');
            element = $compile(element)(scope);
            var map;
            leafletData.getMap().then(function(leafletMap) {
                map = leafletMap;
            });

            var centerParams = {
                c: "30.1" + ":" + "-9.2" + ":" + "4"
            };

            $location.search(centerParams);
            $rootScope.$digest();

            expect(map.getCenter().lat).toBeCloseTo(30.1);
            expect(map.getCenter().lng).toBeCloseTo(-9.2);
            expect(map.getZoom()).toEqual(4);
        });

        it('should update the url hash if changes the center', function() {
            var element = angular.element('<leaflet center="center" url-hash-center="yes"></leaflet>');
            element = $compile(element)(scope);
            scope.center = { lat: 9.5, lng: -1.8, zoom: 8 };
            var centerUrlHash;
            scope.$on("centerUrlHash", function(event, u) {
                centerUrlHash = u;
            });
            scope.$digest();
            expect(centerUrlHash).toBe('9.5:-1.8:8');
        });
    });
});
