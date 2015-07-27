define( [
    'osg/Utils',
    'osg/Matrix',
    'osg/MatrixTransform',
    'osgAnimation/UpdateSkeleton',
    'osg/NodeVisitor',
    'osgAnimation/UpdateMatrixTransform'
], function ( MACROUTILS, Matrix, MatrixTransform, UpdateSkeleton, NodeVisitor, UpdateMatrixTransform ) {

    'use strict';

    var ResetBindPoseVisitor = function () {
        NodeVisitor.call( this, NodeVisitor.TRAVERSE_ALL_CHILDREN );
    };
    ResetBindPoseVisitor.prototype = MACROUTILS.objectInherit( NodeVisitor.prototype, {
        apply: function ( node ) {
            if ( node instanceof MatrixTransform ) {
                var cb = node.getUpdateCallback();
                if ( cb instanceof UpdateMatrixTransform ) {
                    var stackedTransforms = cb._stackedTransforms;
                    for ( var st = 0, l = stackedTransforms.length; st < l; st++ ) {
                        var stackedTransform = stackedTransforms[ st ];
                        stackedTransform.resetBindPose();
                    }
                    cb.computeChannels();
                }
            }
            this.traverse( node );
        }
    } );

    var resetter = new ResetBindPoseVisitor();

    var Skeleton = function () {
        MatrixTransform.call( this );
    };

    Skeleton.prototype = MACROUTILS.objectLibraryClass( MACROUTILS.objectInherit( MatrixTransform.prototype, {

        setDefaultUpdateCallback: function () {
            this.setUpdateCallback( new UpdateSkeleton() );
        },

        resetBindPose: function () {
            this.accept( resetter );
        }

    } ), 'osgAnimation', 'Skeleton' );
    MACROUTILS.setTypeID( Skeleton );

    return Skeleton;
} );
