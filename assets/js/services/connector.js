/**
 * Created by Khalid on 11/6/2017.
 */
/**
 * @ngdoc factory
 * @name connector
 * @description Responsible for:  <br />
 * &nbsp;&nbsp; a) send encrypted data to live serve
 */

app.factory('connector', function ($http, $q, $rootScope, $log, $timeout) {
    return {
        'send': function (data, serviceURL, connectionMethod, headers) {
            var startTime = new Date().getTime();
            var $this = this;
            var deferred = $q.defer();

            var url = CONSTANTS.BASE_URL + serviceURL;

            var requestMethod = 'POST';

            if (angular.isDefined(connectionMethod) && connectionMethod != null) {
                requestMethod = connectionMethod;
            }
            var handleSuccessFlow = function (data, status, headers, config) {
                    
                    $log.debug('Response on spot');
                    if (angular.isString(data)) {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                        }
                    }
                    $log.debug(data);
                    var respTime = new Date().getTime() - startTime;
                    $log.debug("This service took " + respTime + " ms");


                    deferred.resolve({
                        data: data,
                        'responseDuration': respTime
                    });
                },
                handleErrorFlow = function (data, status, headers, config) {
                    
                    var respTime = new Date().getTime() - startTime;

                    $log.debug('\\\\\\\\Error on spot - start\\\\\\\\\\\\\\');
                    $log.debug(data);
                    $log.debug('\\\\\\\\status\\\\\\\\\\\\\\');
                    $log.debug(status);
                    $log.debug('\\\\\\\\headers\\\\\\\\\\\\\\');
                    $log.debug(headers);
                    $log.debug('\\\\\\\\config\\\\\\\\\\\\\\');
                    $log.debug(config);
                    $log.debug('\\\\\\\\Error on spot - end\\\\\\\\\\\\\\');

                    var errorObject = {
                        'status': status,
                        'plainResponse': data,
                        'responseDuration': respTime
                    };


                    deferred.reject(errorObject);

                },
                sendHttpRequest = function () {
                    
                    var requestHeaders = '';
                    if (angular.isDefined(headers) && headers != null) {
                        requestHeaders = headers;
                    } else {
                        requestHeaders = {
                            "Content-Type": "application/json"
                        }
                    }
                    $http({
                        url: url,
                        method: requestMethod,
                        data: JSON.stringify(data),
                        headers: requestHeaders
                    }).success(function (data, status, headers, config) {

                        handleSuccessFlow(data, status, headers, config);
                    }).error(function (data, status, headers, config) {
                        handleErrorFlow(data, status, headers, config);
                    });
                },

                handleSendHttpRequest = function () {
                    //initializeTimout();
                    sendHttpRequest();
                };
            handleSendHttpRequest();

            return deferred.promise;
        }
    };
});