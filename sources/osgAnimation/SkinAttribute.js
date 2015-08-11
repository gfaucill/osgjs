define( [
    'osg/Map',
    'osg/Utils',
    'osg/StateAttribute',
    'osg/Uniform'
], function ( Map, MACROUTILS, StateAttribute, Uniform ) {

    'use strict';

    /**
     * SkinAttribute encapsulate Animation State
     * @class SkinAttribute
     * @inherits StateAttribute
     */
    var SkinAttribute = function ( disable, boneSize ) {
        StateAttribute.call( this );
        this._enable = !disable;
        this._boneSize = boneSize; // optional, if it's not provided, it will fall back to the maximum bone size
    };

    SkinAttribute.uniforms = {};
    SkinAttribute.maxBoneSize = 1;
    SkinAttribute.maxBoneAllowed = Infinity; // can be overriden by application specific limit on startup (typically gl limit)

    SkinAttribute.prototype = MACROUTILS.objectLibraryClass( MACROUTILS.objectInherit( StateAttribute.prototype, {

        attributeType: 'SkinAttribute',
        cloneType: function () {
            return new SkinAttribute( true, this._boneSize );
        },
        setBoneSize: function ( boneSize ) {
            this._boneSize = boneSize;
        },
        getBoneSize: function () {
            return this._boneSize !== undefined ? this._boneSize : SkinAttribute.maxBoneSize;
        },

        getTypeMember: function () {
            return this.attributeType + '_' + this.getBoneSize();
        },

        getOrCreateUniforms: function () {
            // uniform are once per CLASS attribute, not per instance
            var obj = SkinAttribute;
            var typeMember = this.getTypeMember();

            if ( obj.uniforms[ typeMember ] ) return obj.uniforms[ typeMember ];

            var uniforms = {};
            uniforms[ 'uBones' ] = new Uniform.createFloat4Array( [], 'uBones' );
            obj.uniforms[ typeMember ] = new Map( uniforms );

            return obj.uniforms[ typeMember ];
        },
        setMatrixPalette: function ( matrixPalette ) {
            this._matrixPalette = matrixPalette;
            // update max bone size
            if ( this._boneSize === undefined ) {
                SkinAttribute.maxBoneSize = Math.max( SkinAttribute.maxBoneSize, matrixPalette.length / 4 );
                SkinAttribute.maxBoneSize = Math.min( SkinAttribute.maxBoneAllowed, SkinAttribute.maxBoneSize );
            }
        },
        getMatrixPalette: function () {
            return this._matrixPalette;
        },
        // need a isEnabled to let the ShaderGenerator to filter
        // StateAttribute from the shader compilation
        isEnabled: function () {
            return this._enable;
        },
        // isSkinAnimated: function () {
        //     return this._boneSize > 0;
        // },
        // isMorphAnimated: function () {
        //     return this._nbTarget > 0;
        // },
        getHash: function () {
            // bonesize is important, as the shader itself
            // has a different code and uniform are not shared
            // geoms have each their own bones matrix palette
            // it's up to rigGeometry to use same anim Attrib per
            // same bone matrix palette
            // as uniform array size must be statically declared
            // in shader code
            return this.getTypeMember() + this.isEnabled();
        },

        apply: function () {
            if ( !this._enable )
                return;

            var uniformMap = this.getOrCreateUniforms();
            uniformMap.uBones.glData = uniformMap.uBones.data = this._matrixPalette; // hack to avoid copy

            this.setDirty( false );
        }

    } ), 'osgShadow', 'SkinAttribute' );

    MACROUTILS.setTypeID( SkinAttribute );

    return SkinAttribute;
} );
