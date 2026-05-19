import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Badge, Card } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import type { UserProfile } from '../types';

type ProfileHeaderCardProps = {
  profile: UserProfile;
};

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      
      {/* 1. Cụm Avatar & Badge ở trên cùng, căn giữa */}
      <View style={styles.avatarWrapper}>
        {/* Tăng kích thước Avatar lên để giống ảnh */}
        <Avatar name={profile.displayName} avatarUrl={profile.avatarUrl} size={120} /> 
        
        <View style={styles.badgeContainer}>
          <Badge
            variant="brand"
            size="sm"
            style={styles.badge}
          >
            Friend
          </Badge>
        </View>
      </View>

      {/* 2. Cụm Thông tin cá nhân ở dưới */}
      <View style={styles.infoColumn}>
        <AppText variant="title" style={styles.displayName} numberOfLines={1}>
          {profile.displayName}
        </AppText>
        <AppText variant="body" style={styles.username}>
          @{profile.username}
        </AppText>
        
        {/* Vẫn giữ lại phần Email nếu có, nhưng được căn giữa */}
        {profile.email ? (
          <AppText variant="caption" style={styles.meta}>
            {profile.email}
          </AppText>
        ) : null}
      </View>

      {/* 3. Phần Bottom: Tiểu sử (Bio) */}
      {profile.bio ? (
        <View style={styles.bioContainer}>
          <View style={styles.divider} />
          <AppText variant="body" style={styles.bio}>
            {profile.bio}
          </AppText>
        </View>
      ) : null}
      
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      padding: theme.spacing[24],
      alignItems: 'center', // Căn giữa toàn bộ nội dung trong thẻ
    },
    
    // --- XỬ LÝ AVATAR & BADGE ---
    avatarWrapper: {
      position: 'relative', 
      marginBottom: theme.spacing[16], // Tạo khoảng cách với phần Tên ở dưới
    },
    badgeContainer: {
      position: 'absolute',
      bottom: 4,
      right: -8, // Kéo lệch badge ra khỏi viền avatar một chút
      /* Hiệu ứng viền cắt (cut-out) giữa badge và avatar */
      borderWidth: 3,
      borderRadius: 20, // Bo góc lớn để tạo hình viên thuốc
      overflow: 'hidden',
    },
    badge: {
      backgroundColor: '#A84414', // Mã màu cam/nâu tương tự trong ảnh
      paddingHorizontal: 8, // Kéo dài badge ra hai bên
    },

    // --- XỬ LÝ TEXT ---
    infoColumn: {
      alignItems: 'center', // Căn giữa tất cả các dòng text
      gap: theme.spacing[4],
    },
    displayName: {
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      fontSize: 28, // Tăng kích thước chữ cho nổi bật giống ảnh
      textAlign: 'center',
    },
    username: {
      color: theme.colors.text.secondary,
      fontSize: 16,
      textAlign: 'center',
    },
    meta: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
    },

    // --- XỬ LÝ BIO ---
    bioContainer: {
      marginTop: theme.spacing[16],
      width: '100%', // Đảm bảo phần bio chiếm toàn bộ chiều ngang card
      alignItems: 'center',
    },
    divider: {
      height: 1,
      width: '80%', // Đường kẻ ngang chiếm 80% chiều rộng
      marginBottom: theme.spacing[12],
    },
    bio: {
      color: theme.colors.text.primary,
      lineHeight: 22,
      textAlign: 'center',
    },
  });
}