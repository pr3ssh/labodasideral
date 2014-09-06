define(function(require, exports, module) {
  var Engine    = require('famous/core/Engine');
  var View      = require('famous/core/View');
  var Surface   = require('famous/core/Surface');
  var Modifier  = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var Utility   = require('famous/utilities/Utility');
  var PageView  = require('views/PageView');
  var FanView   = require('views/FanView');
  var LoadView  = require('views/LoadView');

  var AppView = function(){
    View.apply(this, arguments);
    _createPageView.call(this);
    _createFanView.call(this);
    _createLoadView.call(this);
  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    zones: ['Despega', 'El Momento', 'Coordenadas', 'Tu Nave', 'Chapa y Pintura', 'Consejos Siderales'],
    currentZone: 'Despega'
  };

  var _createPageView = function(){
    this.pageView = new PageView({
      zones: this.options.zones,
      currentZone: 'Despega'
    });

    this.pageView.on('ZoneClick', function() {
      this.pageView.toggleGradient();
      this.fanMod.setTransform(
        Transform.translate(22, 0, 0),
        { duration: 250 },
        this.fanView.open.bind(this.fanView)
      );
    }.bind(this));

    this._add(this.pageView);
  };

  var _createFanView = function(){
    
    this.fanView = new FanView({zones:this.options.zones});
    
    this.fanMod = new Modifier(
      Transform.translate(-window.innerWidth, 0, 0)
    );

    this.fanView.on('FanClosed', function() {
      this.loadView.spinCount = 0;
      this.frontMod.setTransform( Transform.translate(0,0,900) );
      this.loadView.show(
        function(){
          this.pageView.currentZone = this.pageView.currentZone || 'Despega';
          switch (this.pageView.currentZone)
          {
            case 'Despega':
              this.pageView.headerLocationSurf.setContent('');
              this.pageView.contentMod.setOpacity(1);
              this.pageView.contentMod2.setOpacity(1);
              break;
            case 'El Momento':
              this.pageView.headerLocationSurf.setContent('<h6>EL MOMENTO</h6><p>La ceremonia civil tendrá lugar el 29 de Noviembre de 2014 a las 19h en la Bodeguita Nueva de El Cortijo.<br>Seguidamente el cocktail, la cena y la barra libre serán en el mismo complejo.<br>Ser puntual es LO MÁS<br>Y confirmar asistencia... SUBLIME</p>');
              this.pageView.contentMod.setOpacity(0);
              this.pageView.contentMod2.setOpacity(0);
              break;
            case 'Coordenadas':
              this.pageView.headerLocationSurf.setContent("<h6>COORDENADAS</h6><p>El Cortijo<br>Calle del Rosario, 11<br>Bollullos Par del Condado<br>Huelva<br><img class='map' src='img/mapa.png' /></p>");
              this.pageView.contentMod.setOpacity(0);
              this.pageView.contentMod2.setOpacity(0);
              break;
            case 'Tu Nave':
              this.pageView.headerLocationSurf.setContent("<h6>¿CUÁL ES TU NAVE?</h6><p>Desde Huelva, puedes ir en el bus que pondremos para ir al evento.<br>Saldrá a las 18h del Monteconquero.<br>Habrán 3 vueltas a diferentes horarios.<br>Reserva tu plaza en:<br><br><span class='email'>labodasideral@gmail.com</span></p>");
              this.pageView.contentMod.setOpacity(0);
              this.pageView.contentMod2.setOpacity(0);
              break;
            case 'Chapa y Pintura':
              this.pageView.headerLocationSurf.setContent("<h6>CHAPA Y PINTURA</h6><p>Nuestra nave está más que equipada desde hace años luz.<br><br>IBAN: ES94<br>CUENTA: 2100-2524-01-0210120815<br><br>El titular es<br>Pablo Martín Muñoz</p>");
              this.pageView.contentMod.setOpacity(0);
              this.pageView.contentMod2.setOpacity(0);
              break;
            case 'Consejos Siderales':
              this.pageView.headerLocationSurf.setContent("<h6>CONSEJOS SIDERALES</h6><p>* Salón climatizado, no flipes con el abrigo<br><br>* Ponte guap@ pero cómod@<br><br>* En el perfil de Spotify del usuario 'margui Ru He' podréis ver la lista de canciones de la barra libre y aportar. SIn a b1, b2 y b3</li></ul></p>");
              // #339999 y #FFFFFF
              this.pageView.contentMod.setOpacity(0);
              this.pageView.contentMod2.setOpacity(0);
              break;
          }
        }.bind(this)
      );

      this.fanMod.setTransform( Transform.translate(-window.innerWidth, 0, 0), {
        duration: 2000,
        curve: 'linear'
      });
    }.bind(this) );

    this.fanView.on('clicked', function(data){
      console.log("Check data: " + data);
      this.pageView.currentZone = data.data ? data.data.zone : this.pageView.currentZone;
      this.pageView.toggleGradient();
    }.bind(this));

    this._add(this.fanMod).add(this.fanView);
  };

  var _createLoadView = function(){
    this.loadView = new LoadView();
    
    this.frontMod = new Modifier({
      transform: Transform.translate(0,0,-1000)
    });

    this.loadView.rotatorView.on('revolution', function() {
      this.loadView.spinCount += 1;
      if (this.loadView.spinCount === 2) {
        this.loadView.hide( function(){
          this.frontMod.setTransform( Transform.translate(0,0,-1000) );
          this.pageView.setCurrentTemp(Math.floor(Math.random()*10 + 55));
        }.bind(this));
      }
    }.bind(this));

    this._add(this.frontMod).add(this.loadView)
  };

  module.exports = AppView;
});