define( [
    'osg/Utils',
    'osg/Object',
    'osg/Matrix',
    'osg/Quat'
], function ( MACROUTILS, Object, Matrix, Quat ) {

    /**
     *  StackedQuaternion
     */

    'use strict';

    var StackedQuaternion = function ( name, quat ) {
        Object.call( this );

        var value = Quat.create();

        if ( quat ) Quat.copy( quat, value );

        this._target = {
            value: value
        };
        this._bindQuat = Quat.create();

        this.setName( name );
    };

    StackedQuaternion.prototype = MACROUTILS.objectInherit( Object.prototype, {

        setQuaternion: function ( q ) {
            Quat.copy( q, this._target.value );
        },

        setTarget: function ( target ) {
            this._target = target;
        },

        getTarget: function () {
            return this._target;
        },

        setBindQuaternion: function ( q ) {
            Quat.copy( q, this._bindQuat );
        },

        resetBindPose: function () {
            this.setQuaternion( this._bindQuat )
        },

        applyToMatrix: ( function () {
            var matrixTmp = Matrix.create();

            return function applyToMatrix( m ) {
                var mtmp = matrixTmp;
                Matrix.setRotateFromQuat( mtmp, this._target.value );
                Matrix.preMult( m, mtmp );
            };
        } )()

    } );

    return StackedQuaternion;
} );
