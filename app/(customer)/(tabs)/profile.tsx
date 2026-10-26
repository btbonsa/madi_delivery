import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  Camera,
  Check,
  ChevronRight,
  HelpCircle,
  ClipboardList,
  MapPin,
  ShieldCheck,
  User,
  Utensils,
  LogOut,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import {
  updateMyProfileImage,
  updateMyProfilePhone,
} from "../../../services/profiles";
import { uploadProfilePhoto } from "../../../services/profile-photo";

const ProfileRow = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress?: () => void;
  isLast?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center py-3.5 px-4 ${!isLast ? "border-b border-slate-100" : ""
      }`}
  >
    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF2EB]">
      <Icon size={18} color="#016938" />
    </View>
    <View className="ml-3.5 flex-1">
      <Text className="font-anaheim text-md font-semibold font-anaheim-semibold text-slate-900">
        {title}
      </Text>
      <Text
        numberOfLines={1}
        className="font-anaheim mt-0.5 text-xs text-slate-400"
      >
        {subtitle}
      </Text>
    </View>
    <ChevronRight size={16} color="#94A3B8" />
  </Pressable>
);

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [selectedPhoto, setSelectedPhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoMessage, setPhotoMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);
  const [phoneValue, setPhoneValue] = useState(profile?.phone ?? "");
  const [phoneDraft, setPhoneDraft] = useState(profile?.phone ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressDraft, setAddressDraft] = useState("");
  const [editingContact, setEditingContact] = useState<"phone" | "address" | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactMessage, setContactMessage] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let isCurrent = true;
    void AsyncStorage.getItem(`localbite:delivery-address:${user.id}`)
      .then((savedAddress) => {
        if (!isCurrent) return;
        setDeliveryAddress(savedAddress ?? "");
        setAddressDraft(savedAddress ?? "");
      })
      .catch(() => {
        if (isCurrent) {
          setDeliveryAddress("");
          setAddressDraft("");
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [user?.id]);

  const displayName = profile?.full_name || "LocalBite Customer";
  const displayEmail = user?.email ?? "Email unavailable";
  const displayPhone = phoneValue.trim() || "Add a phone number for updates";
  const imageUri = selectedPhoto?.uri || profile?.image_url?.trim() || null;

  const uploadPhoto = async (photo: ImagePicker.ImagePickerAsset) => {
    if (isUploading) return;
    setSelectedPhoto(photo);
    setIsUploading(true);
    setUploadProgress(0);
    setPhotoMessage(null);
    try {
      const upload = await uploadProfilePhoto(photo, setUploadProgress);
      if (upload.error || !upload.secureUrl) {
        setPhotoMessage({
          kind: "error",
          text: upload.error || "The photo upload failed.",
        });
        return;
      }

      const updateError = await updateMyProfileImage(upload.secureUrl);
      if (updateError) {
        setPhotoMessage({ kind: "error", text: updateError });
        return;
      }

      const refreshError = await refreshProfile();
      if (!refreshError) {
        setSelectedPhoto(null);
        setPhotoMessage({
          kind: "success",
          text: "Your profile photo has been updated.",
        });
      } else {
        setPhotoMessage({
          kind: "success",
          text: "Photo saved. It will refresh once reconnected.",
        });
      }
    } catch {
      setPhotoMessage({
        kind: "error",
        text: "We couldn't save your profile photo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const choosePhoto = async () => {
    if (isPicking || isUploading) return;
    setPhotoMessage(null);
    setIsPicking(true);
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPhotoMessage({
          kind: "error",
          text: "Allow LocalBite access to your photos to set a picture.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedPhoto(result.assets[0]);
        void uploadPhoto(result.assets[0]);
      }
    } catch {
      setPhotoMessage({
        kind: "error",
        text: "We couldn't open your photo library. Please try again.",
      });
    } finally {
      setIsPicking(false);
    }
  };


  const openContactEditor = (field: "phone" | "address") => {
    setContactMessage(null);
    if (field === "phone") setPhoneDraft(phoneValue);
    else setAddressDraft(deliveryAddress);
    setEditingContact(field);
  };

  const saveContactDetails = async () => {
    if (!user?.id || !editingContact || isSavingContact) return;
    const value =
      editingContact === "phone" ? phoneDraft.trim() : addressDraft.trim();
    if (editingContact === "phone" && value && value.replace(/\D/g, "").length < 7) {
      setContactMessage({ kind: "error", text: "Enter a valid phone number." });
      return;
    }
    if (editingContact === "address" && value && value.length < 5) {
      setContactMessage({ kind: "error", text: "Enter a complete delivery address." });
      return;
    }

    setIsSavingContact(true);
    setContactMessage(null);
    try {
      if (editingContact === "phone") {
        const error = await updateMyProfilePhone(value || null);
        if (error) {
          setContactMessage({ kind: "error", text: error });
          return;
        }
        setPhoneValue(value);
        setEditingContact(null);
        setContactMessage({ kind: "success", text: "Phone number saved." });
        const refreshError = await refreshProfile();
        if (refreshError) {
          setContactMessage({
            kind: "success",
            text: "Phone number saved. It will refresh when your profile reconnects.",
          });
        }
      } else {
        await AsyncStorage.setItem(
          `localbite:delivery-address:${user.id}`,
          value,
        );
        setDeliveryAddress(value);
        setEditingContact(null);
        setContactMessage({ kind: "success", text: "Delivery address saved on this device." });
      }
    } catch {
      setContactMessage({
        kind: "error",
        text: "We couldn't save those details. Please try again.",
      });
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleSignOut = async () => {
    const error = await signOut();
    if (error) Alert.alert("Could not sign out", error);
  };

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      className="flex-1 bg-slate-50"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 48,
      }}
      showsVerticalScrollIndicator={false}
    >

      {/* Refined Profile Banner Header */}
      <View className="pt-10 pb-3 -mx-10 px-5 z-20">
        <LinearGradient
          colors={["#016938", "#028A4B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative background accent */}
        <View
          pointerEvents="none"
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.06]"
        />
        <View
          pointerEvents="none"
          className="absolute -bottom-12 right-6 h-10 w-10 rounded-full bg-emerald-300/[0.08]"
        />

        <View className="flex-row items-center">
          {/* Profile Avatar */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              profile?.image_url
                ? "Change profile photo"
                : "Add profile photo"
            }
            disabled={isPicking || isUploading}
            onPress={() => void choosePhoto()}
            className="relative h-[72px] w-[72px]"
          >
            <View className="h-full w-full overflow-hidden rounded-full border-[2.5px] border-white/80 bg-white/15 items-center justify-center">
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={30} color="#FFFFFF" />
              )}
            </View>

            {/* Camera Badge */}
            <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-[#075C3B] bg-white shadow-sm">
              {isPicking || isUploading ? (
                <ActivityIndicator size="small" color="#075C3B" />
              ) : (
                <Camera size={13} color="#075C3B" />
              )}
            </View>
          </Pressable>

          {/* Profile Details */}
          <View className="ml-4 flex-1 justify-center">
            <Text
              className="font-anaheim text-lg font-bold text-white"
              numberOfLines={1}
            >
              {displayName}
            </Text>

            <Text
              className="font-anaheim mt-1 text-[13px] text-emerald-100/90"
              numberOfLines={1}
            >
              {displayEmail}
            </Text>

            {/* Upload Status */}
            {isUploading && (
              <View className="mt-2">
                <View className="flex-row items-center justify-between">
                  <Text className="font-anaheim text-xs font-medium text-emerald-100">
                    Uploading photo
                  </Text>
                  <Text className="font-anaheim text-xs font-semibold text-white">
                    {Math.round(uploadProgress * 100)}%
                  </Text>
                </View>

                <View className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/20">
                  <View
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, uploadProgress * 100)
                      )}%`,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>


      {/* Photo Feedback Message */}
      {photoMessage && (
        <View
          className={`mt-3 px-4 py-2.5 rounded-xl ${photoMessage.kind === "error" ? "bg-red-50" : "bg-emerald-50"
            }`}
        >
          <Text
            className={
              "font-anaheim " +
              `text-xs font-medium font-anaheim-medium ${photoMessage.kind === "error"
                ? "text-red-700"
                : "text-emerald-800"
              }`
            }
          >
            {photoMessage.text}
          </Text>
        </View>
      )}

      {/* Account Details Section */}
      <Text className="font-anaheim mb-2.5 mt-6 text-xs font-bold font-anaheim-bold uppercase tracking-wider text-slate-400 px-1">
        Your Details
      </Text>
      <View className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden gap-2">
        <ProfileRow
          icon={MapPin}
          title="Delivery Address"
          subtitle={deliveryAddress || "Add your default delivery location"}
          onPress={() => openContactEditor("address")}
        />
        <ProfileRow
          icon={User}
          title="Phone Number"
          subtitle={displayPhone}
          onPress={() => openContactEditor("phone")}
          isLast={true}
        />
      </View>

      {contactMessage && !editingContact && (
        <View
          className={`mt-3 rounded-xl px-4 py-3 ${
            contactMessage.kind === "error" ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          <Text
            className={`font-anaheim text-xs ${
              contactMessage.kind === "error" ? "text-red-700" : "text-emerald-800"
            }`}
          >
            {contactMessage.text}
          </Text>
        </View>
      )}

      {editingContact && (
        <View className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Text className="font-anaheim text-sm font-bold font-anaheim-bold text-slate-900">
            {editingContact === "phone" ? "Phone number" : "Delivery address"}
          </Text>
          <TextInput
            accessibilityLabel={editingContact === "phone" ? "Phone number" : "Delivery address"}
            value={editingContact === "phone" ? phoneDraft : addressDraft}
            onChangeText={editingContact === "phone" ? setPhoneDraft : setAddressDraft}
            placeholder={editingContact === "phone" ? "+251 9…" : "Street, area, or nearby landmark"}
            placeholderTextColor="#94A3B8"
            keyboardType={editingContact === "phone" ? "phone-pad" : "default"}
            autoCapitalize="words"
            multiline={editingContact === "address"}
            className="font-anaheim mt-3 min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900"
          />
          {editingContact === "address" && (
            <Text className="font-anaheim mt-2 text-[11px] leading-4 text-slate-500">
              This default address is saved on this device and used to prefill checkout.
            </Text>
          )}
          {contactMessage?.kind === "error" && (
            <Text accessibilityRole="alert" className="font-anaheim mt-2 text-xs text-red-700">
              {contactMessage.text}
            </Text>
          )}
          <View className="mt-4 flex-row justify-end gap-2">
            <Pressable
              accessibilityRole="button"
              disabled={isSavingContact}
              onPress={() => {
                setEditingContact(null);
                setContactMessage(null);
              }}
              className="min-h-11 justify-center rounded-xl border border-slate-200 px-4"
            >
              <Text className="font-anaheim text-sm font-semibold font-anaheim-semibold text-slate-600">
                Cancel
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSavingContact}
              onPress={() => void saveContactDetails()}
              className="min-h-11 flex-row items-center justify-center rounded-xl bg-[#016938] px-4"
            >
              {isSavingContact ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Check size={15} color="#FFFFFF" />
              )}
              <Text className="font-anaheim ml-2 text-sm font-bold font-anaheim-bold text-white">
                {isSavingContact ? "Saving…" : "Save changes"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* More Options Section */}
      <Text className="font-anaheim mb-2.5 mt-6 text-xs font-bold font-anaheim-bold uppercase tracking-wider text-slate-400 px-1 gap-2">
        More
      </Text>
      <View className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <ProfileRow
          icon={ClipboardList}
          title="Order History"
          subtitle="Review and track your orders"
          onPress={() => router.navigate("/(customer)/(tabs)/orders")}
        />
        <ProfileRow
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Get help with LocalBite"
        />
        <ProfileRow
          icon={ShieldCheck}
          title="Privacy Policy"
          subtitle="How your info is handled"
        />
        <ProfileRow
          icon={Utensils}
          title="About LocalBite"
          subtitle="Local food, delivered simply"
          isLast={true}
        />
      </View>

      {/* Sign Out Button */}
      <Pressable
        accessibilityRole="button"
        className="mt-6 h-12 flex-row items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/60 active:bg-rose-100/60"
        onPress={handleSignOut}
      >
        <LogOut size={16} color="#E11D48" />
        <Text className="font-anaheim ml-2 text-sm font-semibold font-anaheim-semibold text-rose-600">
          Log Out
        </Text>
      </Pressable>
    </ScrollView>
  );
}
