define( [
    'osg/Utils',
    'osg/Object',
    'osg/Matrix',
    'osgAnimation/Vec3Target',
    'osg/Vec3'
], function ( MACROUTILS, Object, Matrix, Vec3Target, Vec3 ) {


    /**
     *  StackedTranslate
     */
    var StackedTranslate = function ( name, translate ) {
        Object.call( this );

        var value = Vec3.create();
        if ( translate ) Vec3.copy( translate, value );

        this._target = {
            value: value
        };
        this._bindTranslate = Vec3.create();
        if ( name ) this.setName( name );
    };


    StackedTranslate.prototype = MACROUTILS.objectInherit( Object.prototype, {

        setTranslate: function ( translate ) {
            Vec3.copy( translate, this._target.value );
        },

        setTarget: function ( target ) {
            this._target = target;
        },

        getTarget: function () {
            return this._target;
        },

        setBindTranslate: function ( translate ) {
            Vec3.copy( translate, this._bindTranslate );
        },

        resetBindPose: function () {
            this.setTranslate( this._bindTranslate );
        },

        applyToMatrix: function ( m ) {
            Matrix.preMultTranslate( m, this._target.value );
        }
    } );

    return StackedTranslate;
} );
