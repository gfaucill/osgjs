( function () {
    'use strict';

    var OSG = window.OSG;
    var osg = OSG.osg;
    var osgUtil = OSG.osgUtil;
    var osgViewer = OSG.osgViewer;
    var osgDB = OSG.osgDB;
    var osgAnimation = OSG.osgAnimation;

    var FindAnimationManagerVisitor = function () {
        osg.NodeVisitor.call( this, osg.NodeVisitor.TRAVERSE_ALL_CHILDREN );
        this._cb = undefined;
    };
    FindAnimationManagerVisitor.prototype = osg.objectInherit( osg.NodeVisitor.prototype, {
        init: function () {
            this.found = [];
        },
        getAnimationManager: function () {
            return this._cb;
        },
        apply: function ( node ) {
            var cbs = node.getUpdateCallbackList();
            for ( var i = 0, l = cbs.length; i < l; i++ ) {
                if ( cbs[ 0 ] instanceof osgAnimation.BasicAnimationManager ) {
                    this._cb = cbs[ 0 ];
                    return;
                }
            }
            this.traverse( node );
        }
    } );

    var createScene = function ( viewer ) {
        var root = new osg.Node();
        osgDB.readNodeURL( '../media/models/animation/skinmorph.osgjs' ).then( function ( node ) {
            root.addChild( node );
            var gizmo = new osgUtil.NodeGizmo( viewer );
            gizmo._autoInsertMT = true;
            root.addChild( gizmo );
            viewer.getManipulator().computeHomePosition();

            console.log( root );
            window.finder = new FindAnimationManagerVisitor();
            root.accept( finder );
            window.manager = finder.getAnimationManager();
            manager.playAnimation( 'Take 001' );
        } );
        return root;
    };

    var onLoad = function () {

        var canvas = document.getElementById( 'View' );

        var viewer = new osgViewer.Viewer( canvas );
        viewer.init();
        viewer.setSceneData( createScene( viewer ) );
        viewer.setupManipulator();
        viewer.run();
    };

    window.addEventListener( 'load', onLoad, true );
} )();
