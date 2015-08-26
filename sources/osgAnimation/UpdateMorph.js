define( [
    'osg/Utils',
    'osgAnimation/RigGeometry',
    'osgAnimation/AnimationUpdateCallback',
], function ( MACROUTILS, RigGeometry, AnimationUpdateCallback ) {
    'use strict';

    var UpdateMorph = function () {
        AnimationUpdateCallback.call( this );

        this._needInit = true;
        this._targets = {};
    };

    UpdateMorph.prototype = MACROUTILS.objectInherit( AnimationUpdateCallback.prototype, {

        init: function ( node ) {

            var MorphGeometry = require( 'osgAnimation/MorphGeometry' );

            var findTarget = function ( target, name, manager ) {
                var animations = manager._instanceAnimations;
                var keys = Object.keys( animations );
                for ( var i = 0, l = keys.length; i < l; i++ ) {
                    var animation = animations[ keys[ i ] ];
                    var channels = animation.channels;

                    for ( var c = 0, m = channels.length; c < m; c++ ) {
                        var channel = channels[ c ];
                        if ( channel.channel.target === target && parseInt( channel.channel.name ) === name ) {
                            return manager._targets[ channel.targetID ];
                        }
                    }
                }
            };

            //Find the morph geometry & link targets
            var children = node.getChildren();
            for ( var i = 0, l = children.length; i < l; i++ ) {
                var geom = children[ i ];
                var morph;
                if ( geom instanceof MorphGeometry )
                    morph = geom;
                else if ( geom instanceof RigGeometry && geom.getSourceGeometry() instanceof MorphGeometry ) {
                    morph = geom.getSourceGeometry();
                }

                if ( morph ) {
                    if ( morph.needInit() && morph.init() ) return true;

                    var thisName = this.getName();
                    var targets = morph.getTargets();
                    for ( i = 0, l = targets.length; i < l; i++ ) {
                        var target = targets[ i ];
                        if ( target.getName() === thisName ) {
                            this._targets[ i ] = findTarget( target.getName(), i, morph._manager );
                        }
                    }

                    this._morphGeometry = morph;
                    this._needInit = false;
                }
            }
        },

        needInit: function () {
            return this._needInit;
        },

        update: function ( node /*, nv*/ ) {

            if ( this.needInit() )
                this.init( node );

            var morph = this._morphGeometry;
            if ( morph ) {

                // Send value to the shader
                var array = morph.getTargetsWeight();

                var targets = Object.keys( this._targets );
                for ( var i = 0, l = targets.length; i < l; i++ ) {
                    var key = targets[ i ];
                    if ( this._targets[ parseInt( key ) ] )
                        array[ parseInt( key ) ] = this._targets[ parseInt( key ) ].value;
                }
            }
            return true;
        }

    } );
    return UpdateMorph;

} );
