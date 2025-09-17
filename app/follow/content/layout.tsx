import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewsCard from "../../components/NewsCard";

import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const FollowContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2 m-1 flex-wrap lg:flex-nowrap">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Reddit">Reddit</SelectItem>
              <SelectItem value="Pinterest">Pinterest</SelectItem>
              <SelectItem value="Snapchat">Snapchat</SelectItem>
              <SelectItem value="Discord">Discord</SelectItem>
              <SelectItem value="Telegram">Telegram</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="WeChat">WeChat</SelectItem>
              <SelectItem value="Weibo">Weibo</SelectItem>
              <SelectItem value="Weixin">Weixin</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search"
            className="rounded-full"
            icon={<Search size={16} />}
            iconPosition="right"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)] pr-4">
          <div className="flex flex-col gap-4">
            <NewsCard
              title="Title"
              image="https://via.placeholder.com/150"
              summary="SummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummarySummary"
              platform="Twitter"
              time="2025-01-01"
            />
            <NewsCard
              title="Title"
              image="https://via.placeholder.com/150"
              summary="SummarySummarySummarySummarySummarySummarySummarySummarySummary"
              platform="Twitter"
              time="2025-01-01"
              mark={true}
            />
            <NewsCard
              title="Title"
              summary="Summary"
              platform="Twitter"
              time="2025-01-01"
            />
            <NewsCard
              title="Title"
              summary="Summary"
              platform="Twitter"
              time="2025-01-01"
              mark={true}
            />
            <NewsCard
              title="Title"
              image="https://via.placeholder.com/150"
              summary="Summary"
              platform="Twitter"
              time="2025-01-01"
            />
            <NewsCard
              title="Title"
              image="https://via.placeholder.com/150"
              summary="Summary"
              platform="Twitter"
              time="2025-01-01"
            />
            <NewsCard
              title="Title"
              image="https://via.placeholder.com/150"
              summary="Summary"
              platform="Twitter"
              time="2025-01-01"
            />
          </div>
        </ScrollArea>
      </div>

      <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

export default FollowContentLayout;
