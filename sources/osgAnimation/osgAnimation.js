define( [
    'osg/Utils',
    'osgAnimation/Animation',
    'osgAnimation/SkinAttribute',
    'osgAnimation/AnimationUpdateCallback',
    'osgAnimation/BasicAnimationManager',
    'osgAnimation/Bone',
    'osgAnimation/Channel',
    'osgAnimation/CollectAnimationUpdateCallbackVisitor',
    'osgAnimation/MorphAttribute',
    'osgAnimation/Easing',
    'osgAnimation/Interpolator',
    'osgAnimation/MorphGeometry',
    'osgAnimation/RigGeometry',
    'osgAnimation/Skeleton',
    'osgAnimation/StackedMatrix',
    'osgAnimation/StackedQuaternion',
    'osgAnimation/StackedRotateAxis',
    'osgAnimation/StackedScale',
    'osgAnimation/StackedTranslate',
    'osgAnimation/UpdateBone',
    'osgAnimation/UpdateMatrixTransform',
    'osgAnimation/UpdateMorph',
    'osgAnimation/UpdateSkeleton'
], function ( MACROUTILS, Animation, SkinAttribute, AnimationUpdateCallback, BasicAnimationManager, Bone, Channel, CollectAnimationUpdateCallbackVisitor, MorphAttribute, Easing, Interpolator, MorphGeometry, RigGeometry, Skeleton, StackedMatrix, StackedQuaternion, StackedRotateAxis, StackedScale, StackedTranslate, UpdateBone, UpdateMatrixTransform, UpdateMorph, UpdateSkeleton ) {

    'use strict';

    var osgAnimation = {};

    MACROUTILS.objectMix( osgAnimation, Easing );
    MACROUTILS.objectMix( osgAnimation, Interpolator );
    osgAnimation.Animation = Animation;
    osgAnimation.SkinAttribute = SkinAttribute;
    osgAnimation.AnimationUpdateCallback = AnimationUpdateCallback;
    osgAnimation.BasicAnimationManager = BasicAnimationManager;
    osgAnimation.Bone = Bone;
    osgAnimation.Channel = Channel;
    osgAnimation.CollectAnimationUpdateCallbackVisitor = CollectAnimationUpdateCallbackVisitor;
    osgAnimation.MorphAttribute = MorphAttribute;
    osgAnimation.MorphGeometry = MorphGeometry;
    osgAnimation.RigGeometry = RigGeometry;
    osgAnimation.Skeleton = Skeleton;
    osgAnimation.StackedMatrix = StackedMatrix;
    osgAnimation.StackedQuaternion = StackedQuaternion;
    osgAnimation.StackedRotateAxis = StackedRotateAxis;
    osgAnimation.StackedScale = StackedScale;
    osgAnimation.StackedTranslate = StackedTranslate;
    osgAnimation.UpdateBone = UpdateBone;
    osgAnimation.UpdateMatrixTransform = UpdateMatrixTransform;
    osgAnimation.UpdateMorph = UpdateMorph;
    osgAnimation.UpdateSkeleton = UpdateSkeleton;

    return osgAnimation;
} );
