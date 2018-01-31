/**
 * Created by amohamed on 4/7/2016.
 */
var translator = angular.module('translator', ['pascalprecht.translate'])
    .config(['$translateProvider', function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'assets/js/translation/locales/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.forceAsyncReload(true);
        $translateProvider.useLoaderCache(true);

    }]);
if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}
translator.service('translation', ["$http", "$log", "$q", "$translate", "$filter", function ($http, $log, $q, $translate, $filter) {
    return {
        translateObj: false,
        getTranslateObject: function () {
            if (this.translateObj) {
                return this.translateObj;
            } else {
                this.translateObj = $translate;
                return this.translateObj;
            }
        },
        getTranslated: function (key) {
            var translated = $translate.instant(key);
            if (translated == '' || translated == key) {
                $log.warn('Translation failed for ' + key);
                //$translate.refresh();
            }
            return translated;
        },
        getTranslatedWithReference: function (key) {
            var result = '';
            if (typeof (key) === 'object') {
                result = this.getTranslated(key[0]);
                for (var i = 1; i < key.length; i++) {
                    var tobeReplaced = '$$var' + i;
                    result = result.replace(tobeReplaced, key[i]);
                }
            } else {
                result = this.getTranslated(key);
            }
            return result;
        }
    }
}]);

/*
 translator.loadLocale = function (lang) {
 for (var key in localStorage) {
 if (key.indexOf(translator.appprefix) > -1) {
 localStorage.removeItem(key);
 }
 }

 var initInjector = angular.injector(["ng"]);
 var $http = initInjector.get("$http");
 var $q = initInjector.get("$q");
 var deferred = $q.defer();
 var defaultLang = window.localStorage.getItem(translator.langapprev);
 if (!defaultLang) {
 window.localStorage.setItem(translator.langapprev, lang);
 callResources().then(function () {
 deferred.resolve(1);
 }, function () {
 deferred.resolve(0);
 });
 } else {
 if (defaultLang !== lang) {
 window.localStorage.setItem(translator.langapprev, lang);
 callResources().then(function () {
 deferred.resolve(1);
 }, function () {
 deferred.resolve(0);
 });
 } else {
 callResources().then(function () {
 deferred.resolve(1);
 }, function () {
 deferred.resolve(0);
 });
 }
 }
 function callResources() {
 var timestamp = (new Date()).getTime();
 var deferred = $q.defer();
 $http({
 url: 'js/translation/locales/' + lang + '.json?' + timestamp,
 method: "GET",
 timeout: 1000,
 headers: {
 'Content-Type': 'application/json'
 }
 }).success(function (data, status, headers, config) {
 // console.log(data);
 for (var v in data) {
 window.localStorage.setItem(translator.appprefix + v, data[v]);
 }
 deferred.resolve(1);
 }).error(function (data, status, headers, config) {
 deferred.resolve(0);
 });
 return deferred.promise;
 }

 return deferred.promise;
 };
 */