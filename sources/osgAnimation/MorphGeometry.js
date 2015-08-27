define( [
    'osg/Utils',
    'osg/Geometry',
    'osg/StateSet',
    'osgAnimation/MorphAttribute',
    'osg/StateAttribute',
    'osgAnimation/Target'
], function ( MACROUTILS, Geometry, StateSet, MorphAttribute, StateAttribute, Target ) {
    'use strict';

    var MorphGeometry = function () {
        Geometry.call( this );

        this._targets = []; // Target list (Geometry)
        this._weights = {};

        //  {   channelName : targetID,
        //      ...
        //  }
        this._stateSetAnimation = new StateSet();
        this._targetWeights = new Float32Array( 4 );

        this._needInit = true;
    };

    MorphGeometry.prototype = MACROUTILS.objectLibraryClass( MACROUTILS.objectInherit( Geometry.prototype, {

        init: function () {
            var st = this.getStateSetAnimation();
            var animAttrib = new MorphAttribute( this.getTargets().length );
            st.setAttributeAndModes( animAttrib, StateAttribute.ON );
            animAttrib.setTargetWeights( this.getTargetsWeight() );

            return ( this._needInit = false );
        },

        getStateSetAnimation: function () {
            return this._stateSetAnimation;
        },

        getTargets: function () {
            return this._targets;
        },

        getWeight: function ( index ) {
            var target = this._targetWeights[ index ];
            return target ? target.value : 0;
        },

        needInit: function () {
            return this._needInit;
        },

        getTargetsWeight: function () {
            return this._targetWeights;
        },

        setParentRigGeometry: function ( parent ) {
            this._rigParent = parent;
        },

        getParentRigGeometry: function () {
            return this._rigParent;
        }

    } ), 'osgAnimation', 'MorphGeometry' );

    MACROUTILS.setTypeID( MorphGeometry );

    return MorphGeometry;
} );
