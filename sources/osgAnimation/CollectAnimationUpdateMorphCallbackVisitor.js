define( [
    'osg/Notify',
    'osg/Utils',
    'osg/NodeVisitor',
    'osgAnimation/AnimationUpdateCallback',
    'osgAnimation/UpdateMorph',
    'osgAnimation/RigGeometry'
], function ( Notify, MACROUTILS, NodeVisitor, AnimationUpdateCallback, UpdateMorph, RigGeometry ) {

    'use strict';

    // search into a subgraph all updateMorph
    var CollectAnimationUpdateMorphCallbackVisitor = function () {
        NodeVisitor.call( this );
        this._animationUpdateCallback = {};
        this._callbackUniqIdMap = {};
    };


    CollectAnimationUpdateMorphCallbackVisitor.prototype = MACROUTILS.objectInherit( NodeVisitor.prototype, {
        getAnimationUpdateCallbackMap: function () {
            return this._animationUpdateCallback;
        },

        getCallbackUniqIdMap: function () {
            return this._callbackUniqIdMap;
        },

        apply: function ( node ) {
            var cbs = node.getUpdateCallbackList();

            for ( var i = 0, cbsLength = cbs.length; i < cbsLength; i++ ) {
                var cb = cbs[ i ];
                if ( cb instanceof UpdateMorph ) {
                    this._animationUpdateCallback[ cb.getInstanceID() ] = [ node, cb ];
                }
            }
            this.traverse( node );
        },

        computeCallbackUniqIdMap: function () {

            var MorphGeometry = require( 'osgAnimation/MorphGeometry' );

            var animationUpdateCallback = this._animationUpdateCallback;
            var callbackUniqIdMap = this._callbackUniqIdMap;
            var keys = Object.keys( animationUpdateCallback );

            for ( var i = 0, l = keys.length; i < l; i++ ) {
                var cbId = keys[ i ];
                var value = animationUpdateCallback[ cbId ];
                var node = value[ 0 ];
                var cb = value[ 1 ];

                //Find Morph geometry in children list
                var children = node.getChildren();
                for ( var j = 0, m = children.length; j < m; j++ ) {
                    var child = children[ j ];

                    var morph;

                    if ( child instanceof MorphGeometry ) {
                        morph = child;
                    } else if ( child instanceof RigGeometry ) {
                        var source = child.getSourceGeometry();
                        if ( source instanceof MorphGeometry ) {
                            morph = source;
                        }
                    } else {
                        continue;
                    }

                    var targets = morph.getTargets();
                    for ( var t = 0, nbTarget = targets.length; t < nbTarget; t++ ) {
                        var target = targets[ t ];
                        if ( target.getName() !== cb.getName() ) continue;
                        var uniqId = cb.getName() + '.' + t;
                        callbackUniqIdMap[ uniqId ] = cb;
                    }
                }
            }
        }

    } );

    return CollectAnimationUpdateMorphCallbackVisitor;
} );
