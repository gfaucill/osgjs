define( [
    'osg/Utils',
    'osg/Geometry',
    'osg/NodeVisitor',
    'osgAnimation/BasicAnimationManager',
    'osg/StateSet',
    'osgAnimation/MorphAttribute',
    'osg/StateAttribute'
], function ( MACROUTILS, Geometry, NodeVisitor, BasicAnimationManager, StateSet, MorphAttribute, StateAttribute ) {
    'use strict';

    //Find the first AnimationManager
    var FindAnimationManagerVisitor = function () {
        NodeVisitor.call( this, NodeVisitor.TRAVERSE_PARENTS );
        this._cb = undefined;
    };
    FindAnimationManagerVisitor.prototype = MACROUTILS.objectInherit( NodeVisitor.prototype, {
        getAnimationManager: function () {
            return this._cb;
        },
        apply: function ( node ) {
            var cbs = node.getUpdateCallbackList();
            for ( var i = 0, l = cbs.length; i < l; i++ ) {
                if ( cbs[ i ] instanceof BasicAnimationManager ) {
                    this._cb = cbs[ i ];
                    return;
                }
            }
            this.traverse( node );
        }
    } );

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
            //Find the manager and get targetID
            if ( !this._manager ) {
                var finder = new FindAnimationManagerVisitor();
                var toVisitNode = ( this.getParents().length === 0 ) ? this.getParentRigGeometry() : this;

                toVisitNode.accept( finder );
                this._manager = finder.getAnimationManager();
            }

            if ( this._manager ) { //If we got all we need we stop to call init()
                var st = this.getStateSetAnimation();
                var animAttrib = new MorphAttribute();
                st.setAttributeAndModes( animAttrib, StateAttribute.ON );
                animAttrib.setNbTarget( this.getTargets().length );
                animAttrib.setTargetWeights( this.getTargetsWeight() );

                this._needInit = false;
            }

            return this._needInit;
        },

        getStateSetAnimation: function () {
            return this._stateSetAnimation;
        },

        getTarget: function ( index ) {
            return this._targets[ index ];
        },

        getTargets: function () {
            return this._targets;
        },

        getWeight: function ( targetIndex ) {
            var target = this._manager._targetID[ this._weights[ targetIndex ] ];
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
