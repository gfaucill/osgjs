define( [
    'osg/Utils',
    'osgAnimation/RigGeometry',
    'osgAnimation/AnimationUpdateCallback',
    'osgAnimation/Target',
    'osgAnimation/MorphGeometry'
], function ( MACROUTILS, RigGeometry, AnimationUpdateCallback, Target, MorphGeometry ) {
    'use strict';

    var UpdateMorph = function () {
        AnimationUpdateCallback.call( this );

        this._needInit = true;
        this._targets = {};
    };

    UpdateMorph.prototype = MACROUTILS.objectInherit( AnimationUpdateCallback.prototype, {

        init: function ( node ) {
            //Find the morph geometry & init it
            var children = node.getChildren();
            for ( var i = 0, l = children.length; i < l; i++ ) {
                var geom = children[ i ];
                var morph;
                if ( geom instanceof MorphGeometry )
                    morph = geom;
                else if ( geom instanceof RigGeometry && geom.getSourceGeometry() instanceof MorphGeometry ) {
                    morph = geom.getSourceGeometry();
                }

                if ( !morph ) continue;
                if ( morph.needInit() && morph.init() ) return true;

                this._morphGeometry = morph;
                this._needInit = false;
            }
        },

        needInit: function () {
            return this._needInit;
        },

        getOrCreateTarget: function ( index ) {
            if ( !this._targets[ index ] ) {
                this._targets[ index ] = Target.createFloatTarget( 0 );
            }
            return this._targets[ index ];
        },

        update: function ( node /*, nv*/ ) {
            if ( this.needInit() )
                this.init( node );

            var morph = this._morphGeometry;
            if ( morph ) {
                var array = morph.getTargetsWeight();

                var targets = Object.keys( this._targets );
                for ( var i = 0, l = targets.length; i < l; i++ ) {
                    var key = parseInt( targets[ i ] );
                    var target = this._targets[ key ];
                    if ( target )
                        array[ key ] = target.value;
                }
            }
            return true;
        }

    } );
    return UpdateMorph;

} );
