angular.module('schemaForm').directive('pickATime', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      pickATime: '=',
      minTime: '=',
      maxTime: '=',
      format: '='
    },
    link: function (scope, element, attrs, ngModel) {
      //Bail out gracefully if pickatime is not loaded.
      if (!element.pickatime) {
        return;
      }

      //By setting formatSubmit to null we inhibit the
      //hidden field that pickatime likes to create.
      //We use ngModel formatters instead to format the value.
      var opts = {
        onClose: function () {
          element.blur();
        },
        formatSubmit: null
      };
      if (scope.pickATime) {
        angular.extend(opts, scope.pickATime);
      }
      element.pickatime(opts);

      var defaultFormat = 'HH:i';

      //View format on the other hand we get from the pickatime translation file
      var viewFormat = $.fn.pickatime.defaults.format;

      var picker = element.pickatime('picker');

      //The view value
      ngModel.$formatters.push(function(value) {
        if (angular.isUndefined(value) || value === null) {
          return value;
        }

        //We set 'view' and 'highlight' instead of 'select'
        //since the latter also changes the input, which we do not want.
        picker.set('view', value, {format: scope.format || defaultFormat});
        picker.set('highlight', value, {format: scope.format || defaultFormat});

        //piggy back on highlight to and let pickatime do the transformation.
        return picker.get('highlight', viewFormat);
      });

      ngModel.$parsers.push(function() {
        return picker.get('select', scope.format || defaultFormat);
      });

      //bind once.
      if (angular.isDefined(attrs.mminTimein)) {
        var onceMin = scope.$watch('minTime', function (value) {
          if (value) {
            picker.set('min', value);
            onceMin();
          }
        }, true);
      }

      if (angular.isDefined(attrs.maxTime)) {
        var onceMax = scope.$watch('maxTime', function (value) {
          if (value) {
            picker.set('max', value);
            onceMax();
          }
        }, true);
      }
    }
  };
});
